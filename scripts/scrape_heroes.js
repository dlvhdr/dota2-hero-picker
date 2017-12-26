// @flow

const MWBot = require('mwbot');
const parsoid = require('parsoid');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { List } = require('immutable');
const axios = require('axios');
var fs = require('fs');
var queries = require('../src/queries');

let bot = new MWBot();
bot.setGlobalRequestOptions({
  qs: {
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'revisions',
    rvprop: 'content',
    indexpageids: '',
  },
});
bot.setApiUrl('http://dota2.gamepedia.com/api.php');

const getHeroList = () => {
  return axios.get(
      'http://www.dota2.com/jsfeed/heropickerdata',
      { responseType: 'json' }
  ).then(response => response.data)
  .then(data =>
    Object.entries(data).map(entry => entry[1].name.replace(' ', '_'))
  );
};

const getPageData = (response) => {
  const pageID = response.query.pageids[0];
  return response.query.pages[pageID];
};

const scrapeHero = (heroName) => {
  return bot.read(heroName).then(response => {
    return getPageData(response).revisions[0]['*'];
  })
  .then(res => parsoid.parse(res))
  .then(res => {
      const dom = new JSDOM(res.out);
      const elements = List.of(...dom.window.document.getElementsByTagName('a'));
      return elements.filter(elem =>
        (elem.href == './Template:Hero_infobox' ||
        elem.href == './Template:Ability') && elem.dataset.mw != undefined
      ).map(elem => {
        let infoObject = JSON.parse(elem.dataset.mw).parts[0].template.params;
        return Object.entries(infoObject).reduce(
          (acc, currentValue) =>
            Object.assign(acc, { [currentValue[0]]: currentValue[1].wt }),
          {});
      });
    }
  ).then(parsedElements => {
    let hero = { info: {}, abilities: []};
    parsedElements.forEach((elem, i) => {
      i == 0
        ? hero.info = elem
        : hero.abilities.push(elem);
    });
    return hero;
  });
};

const mapWikiImageToAxiosPromise = (imageName) => {
  return axios.get(
      'http://dota2.gamepedia.com/api.php?format=json&action=query'
      + '&prop=imageinfo&&iiprop=url&indexpageids'
      + '&titles=' + imageName.replace(' ', '%20')
    );
}

const getHeroImageURLs = (hero) => {
  // console.log(hero.info);
  let images = [hero.info.image];
  images.push(...hero.abilities.map(
    ability => ability.image
  ));

  console.log('Fetching images: \n', images);
  return images.map(mapWikiImageToAxiosPromise);
};

const downloadHeroImages = (hero) => {
  axios.all(getHeroImageURLs(hero))
    .then(
      axios.spread(function (...responses) {
        responses.forEach(imageURLResponse => {
          const pageData = getPageData(imageURLResponse.data);
          const imageURL = pageData.imageinfo[0].url;
          console.log(imageURL);

          return axios.get(imageURL, { responseType: 'arraybuffer' })
            .then(imageResponse => new Buffer(imageResponse.data), 'binary')
            .then(buffer => {
              console.log('Saving image: ' + pageData.title);
              fs.writeFile(
                'public/images/' + pageData.title,
                buffer
              );
            });
        });
      }
    ));
};

// getHeroList().then(
//   heroList => {
//     console.log('Handling ' + heroList.length + ' heroes');
//     heroList.forEach(
//       heroName => {
//         scrapeHero(heroName)
//           .then(hero => {
//             saveHeroToDB(hero);
//           })
//       }
//     );
//   }
// );

fs.readFile('heroes/Abaddon.txt', 'utf8', (err, data) => {
  let abaddon = JSON.parse(data);
  downloadHeroImages(abaddon);
});

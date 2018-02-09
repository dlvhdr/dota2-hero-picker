// @flow

const MWBot = require('mwbot');
const parsoid = require('parsoid');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { List } = require('immutable');
const axios = require('axios');
var fs = require('fs');
var db = require('../src/queries');
var argv = require('minimist')(process.argv.slice(2));
const sharp = require('sharp');

// type Hero = {
//   valveName: string,
//   naturalLanguageName: string,
//   attackkType: string,
//   roles: Array<string>
// };

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
  .then(data => {
    return Object.keys(data).map(key => ({
      valveName: key,
      naturalLanguageName: data[key].name,
      atk_type: data[key].atk,
      roles: data[key].roles
    }))
  });
};

const getPageData = (response) => {
  const pageID = response.query.pageids[0];
  return response.query.pages[pageID];
};

const scrapeHero = (heroObj) => {
  console.log('Scraping: ' + heroObj.naturalLanguageName);
  return bot.read(heroObj.naturalLanguageName).then(response => {
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
    console.log('Finished scraping ' + heroObj.naturalLanguageName);
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

const downloadHeroVerticalImages = (valveName, naturalLanguageName = null) => {
  const savedFilesHeroName = naturalLanguageName || valveName;
  console.log(`Downloading vertical images: ${savedFilesHeroName}`);
  return axios.get(
    `http://cdn.dota2.com/apps/dota2/images/heroes/${valveName}_vert.jpg`,
    { responseType: 'arraybuffer' }
  )
    .then(response => new Buffer(response.data, 'binary'))
    .then(imageBuffer => {
      let sharpImage = sharp(imageBuffer);
      sharpImage.toFile(`images/${savedFilesHeroName}_vert.jpg`);
      sharpImage.resize(98, 142)
        .toFile(`images/${savedFilesHeroName}_vert_small.jpg`);
    })
    .catch(err => console.log(err));
};

const shouldDownloadAllImages = false;
if (argv['only-vertical-images'] !== undefined && argv['all'] !== undefined) {
  console.log('Downloading all heroes vertical images');
  getHeroList()
    .then(heroList =>
      heroList.forEach(heroObj => downloadHeroVerticalImages(
        heroObj.valveName
      ))
  );
} else if (argv['all'] !== undefined) {
  getHeroList().then(
    heroList => {
      console.log('Handling ' + heroList.length + ' heroes');
      heroList.forEach(
        valveHeroObj => {
          scrapeHero(valveHeroObj)
            .then(wikiHeroObj => {
              db.insertHero(
                valveHeroObj.valveName,
                wikiHeroObj.info['primary attribute'],
                valveHeroObj.roles,
                valveHeroObj.atk,
                wikiHeroObj
              );
              if (shouldDownloadAllImages) {
                downloadHeroImages(wikiHeroObj);
              }
            })
        }
      );
    }
  );
} else if (argv['only-vertical-images'] !== undefined &&
  argv['hero'] !== undefined) {
  downloadHeroVerticalImages(argv['hero']);
} else if (argv['hero'] !== undefined) {
  getHeroList()
    .then(heroList => heroList.filter(hero => hero.valveName === argv['hero'])[0])
    .then(valveHeroObj => Promise.all([
      Promise.resolve(valveHeroObj),
      scrapeHero(valveHeroObj)
    ]))
    .then(values => {
      const valveHeroObj = values[0];
      const wikiHeroObj = values[1];
      db.insertHero(
        valveHeroObj.valveName,
        wikiHeroObj.info['primary attribute'],
        valveHeroObj.roles,
        valveHeroObj.atk,
        wikiHeroObj
      );
      if (shouldDownloadAllImages) {
        downloadHeroImages(wikiHeroObj);
      }
    })
    .catch(console.log);
} else {
  console.log('Usage:\n' +
  '--all to scrape ALL heroes\n' +
  '--hero <hero_name (e.g. Abaddon)> to scrape just that hero\n' +
  '--all-images to download the hero\'s images: '
    + 'horizontal icon, vertical icon, small vertical icon and abilities\n' +
  '--only-vertical-images use valve name of the hero');
}

// fs.readFile('heroes/Abaddon.txt', 'utf8', (err, data) => {
//   let abaddon = JSON.parse(data);
//   downloadHeroImages(abaddon);
// });

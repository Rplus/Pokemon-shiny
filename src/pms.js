import { getItem } from './u.js';
const today = new Date();

function groupByFamily(pms) {
  let pmsByFamily = pms
    .filter(pm => {
      if (!pm.shiny_released && pm.released_date) {
        pm.shiny_released =  new Date(pm.released_date) < today;
      }
      return pm.shiny_released;
    })
    .reduce((all, pm) => {
      if (!all[pm.family]) {
        all[pm.family] = {
          key: pm.dex,
          pms: [],
          shiny: pm.shiny_released,
          family: pm.family,
          status: {},
        };
      }
      let dex000 = `000${pm.dex}`.slice(-3);
      pm.id = `${pm.dex}${pm.type || ''}${pm.isotope || ''}`;
      pm.fn = pm.fn || `${dex000}${pm.type || '_00'}${pm.isotope || ''}`;
      pm.status = 0;
      all[pm.family].pms.push(pm);
      return all;
    }, {});


  pmsByFamily = Object.entries(pmsByFamily).sort(sortFamily)
  .map(f => {
    f[1].pms.sort(sortPM);
    return f[1];
  });
  pmsByFamily.map = {};

  pmsByFamily.forEach((f, fi) => {
    f.pms.forEach((p, pi) => {
      pmsByFamily.map[p.id] = {
        fi,
        pi,
      };
    });
  });

  return pmsByFamily;
};

function genPmName(data) {
  const [pms, name] = data;
  return pms.map(pm => {
    pm.name = pm.name || {...name[pm.dex]};
    if (!pm.name) {
      console.error('no pm name', pm);
    } else if (pm.name_suffix) {
      for (let lang in pm.name) {
        pm.name[lang] += pm.name_suffix;
      }
    }
    return pm;
  })
}

function sortFamily(a, b) {
  return a[1].key - b[1].key;
};

function sortPM(a, b) {
  return (a.order || a.dex) - (b.order || b.dex);
};

export async function getPM() {
  let forceFetch = !!getItem('config.forceFetch');
  let pms = await Promise.all(
      ['./pms.json' + (forceFetch ? `?${+new Date()}` : ''), './name.json']
        .map(fn => fetch(fn).then(res => res.json()) )
    )
    .then(genPmName)
    .then(groupByFamily);
  return pms;
};

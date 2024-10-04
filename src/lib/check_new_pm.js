import raw_pms from '@data/pm.csv';
import raw_old_pms from '@data/pms.json';

let old_pms = raw_old_pms.filter(a => a.aa_fn).map(i => ({
	pid: i.aa_fn,
	debut: i.released_date,
	group: i.family,
}));

let newer_pms = old_pms.filter(pm => {
	return !raw_pms.some(r => r.pid === pm.pid);
})
let newer_pm_csv = newer_pms.map((i, index) => {
	let { debut, pid, src, group } = i;
	return [index + 1215, debut, pid, src || '', group].join();
})

console.log('string', newer_pm_csv)

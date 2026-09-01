// ⚠️ PORTED LOGIC — kept in sync with app.js by hand, on purpose.
// allBirthdays/_ageLabel/_bmLabel below are copies of the same-named
// functions in app.js. If that logic changes there (new date fields, new
// occasion kinds...), update these too or the daily reminder will quietly
// go stale. (Same warning as debtCalc.js.)

function allBirthdays(families, yahrzeits) {
  const kidBdays = families.flatMap(f => (f.kids || []).filter(k => k.hebDay && k.hebMonth).map(k => ({
    name: (k.name ? k.name : 'ילד/ה') + ' (' + f.name.replace('משפחת', '').trim() + ')',
    hebDay: k.hebDay, hebMonth: k.hebMonth, hebYear: k.hebYear || null, gender: k.gender || '', kind: 'birthday', famId: f.id,
  })));
  const parentBdays = families.flatMap(f => {
    const fam = f.name.replace('משפחת', '').trim();
    const arr = [];
    if (f.parent1Bday && f.parent1Bday.hebDay && f.parent1Bday.hebMonth) arr.push({ name: (f.emailName || 'הורה') + ' (' + fam + ')', hebDay: f.parent1Bday.hebDay, hebMonth: f.parent1Bday.hebMonth, hebYear: f.parent1Bday.hebYear || null, gender: '', kind: 'birthday', famId: f.id });
    if (f.parent2Bday && f.parent2Bday.hebDay && f.parent2Bday.hebMonth) arr.push({ name: (f.emailName2 || 'הורה') + ' (' + fam + ')', hebDay: f.parent2Bday.hebDay, hebMonth: f.parent2Bday.hebMonth, hebYear: f.parent2Bday.hebYear || null, gender: '', kind: 'birthday', famId: f.id });
    return arr;
  });
  const anniversaries = families.filter(f => f.anniversary && f.anniversary.hebDay && f.anniversary.hebMonth).map(f => ({
    name: f.name.replace('משפחת', '').trim(),
    hebDay: f.anniversary.hebDay, hebMonth: f.anniversary.hebMonth, hebYear: f.anniversary.hebYear || null, kind: 'anniversary', famId: f.id,
  }));
  const yahrzeitItems = (yahrzeits || []).filter(y => y.hebDay && y.hebMonth).map(y => ({
    id: y.id, name: y.name || 'יקירנו', hebDay: y.hebDay, hebMonth: y.hebMonth, hebYear: y.hebYear || null, kind: 'yahrzeit',
  }));
  return [...kidBdays, ...parentBdays, ...anniversaries, ...yahrzeitItems];
}

function ageLabel(item, occHebYear) {
  if (!item.hebYear || !occHebYear) return '';
  const n = occHebYear - item.hebYear;
  if (n <= 0) return '';
  if (item.kind === 'anniversary') return ' (' + n + (n === 1 ? ' שנה' : ' שנים') + ' לנישואין)';
  if (item.kind === 'yahrzeit') return ' (' + n + (n === 1 ? ' שנה' : ' שנים') + ' מהפטירה)';
  if (item.gender === 'boy') return ' (בן ' + n + ')';
  if (item.gender === 'girl') return ' (בת ' + n + ')';
  return ' (' + n + ')';
}

function bmLabel(item, occHebYear) {
  if (item.kind !== 'birthday' || !item.hebYear || !occHebYear) return '';
  const n = occHebYear - item.hebYear;
  if (item.gender === 'boy' && n === 13) return 'בר מצווה';
  if (item.gender === 'girl' && n === 12) return 'בת מצווה';
  return '';
}

module.exports = { allBirthdays, ageLabel, bmLabel };

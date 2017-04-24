const NUMBER_GROUPS = /(-?\d*\.?\d+)/g;

function natural_sort_comparer(a, b) {
  var aa = String(a.name).split(NUMBER_GROUPS);
  var bb = String(b.name).split(NUMBER_GROUPS);
  var min = Math.min(aa.length, bb.length);

  for (var i = 0; i < min; i++) {
    var x = parseFloat(aa[i]) || aa[i].toLowerCase(),
        y = parseFloat(bb[i]) || bb[i].toLowerCase();
    if (x < y) return -1;
    else if (x > y) return 1;
  }

  return 0;
}

export { natural_sort_comparer }

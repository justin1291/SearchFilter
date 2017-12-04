export class SearchFilter {

  evaluateFilters(column, value, map, filter, rows, rowsBackup) {
    rows = rowsBackup;
    let rowsCopy = rows;
    map.set(column, value.trim());
    map.forEach((val, key) => {
      rowsCopy = filter.reduce(key, val, rowsCopy);
    });
    return rowsCopy;
  }

  reduce(column: string, restrictionVal: string, rowsCopy: Array<any>) {
    restrictionVal = restrictionVal.toLowerCase();
	//user's search has like '%' 
    if (this.like(restrictionVal)) {
      return this.evaluateLike(column, restrictionVal.split('%'), rowsCopy);
    }

    return this.filterArray(column, restrictionVal, rowsCopy);
  }

  private filterArray(column: string, restrictionVal: string, rowsCopy: Array<any>) {
   if (restrictionVal === '') {
      return rowsCopy;
    } else {
     return rowsCopy.filter(d => {
		 //User searching for "", e.g values of d[coulmn] which are undefined
       if (restrictionVal === '\"\"' && (typeof d[column] === 'undefined') {
         return true;
       } else if (typeof d[column] !== 'undefined')) {
         return this.operatorFilter(d[column], restrictionVal);
       }
     });
   }
  }

  private like(val: string): boolean {
    return val.indexOf('%') !== -1 && val.indexOf('/%') === -1;
  }

  private evaluateLike(column, arr: Array<any>, rows) {
	  //break restrictionVal into pieces and recall reduce filtering on before like '%' and after. i.e 12/%2017 will filter the Result Set twice. 
	  //RS step 1 has all of 12/
	  //RS step 2 further reduces 12/ RS with data that also contains 2017
    for (const restrictionVal of arr) {
      rows = this.reduce(column, restrictionVal, rows);
    }
    return rows;
  }

  private operatorFilter(rowValue, input: string) {
    const operatorInputArr = input.split(' ');
    switch (operatorInputArr[0]) {
      case '>': {
        return rowValue > operatorInputArr[1];
      }
      case '>=': {
        return rowValue >= operatorInputArr[1];
      }
      case '<': {
        return rowValue < operatorInputArr[1];
      }
      case '<=': {
        return rowValue <= operatorInputArr[1];
      }
      case '!=': {
        if  (!isNaN(+operatorInputArr[1])) {
          return parseInt(rowValue, 10) !== parseInt(operatorInputArr[1], 10);
        } else {
          return isNaN(+rowValue) ? rowValue.toLowerCase() !== operatorInputArr[1] : rowValue !== operatorInputArr[1];
        }
      }
      case '==': {
        if (!isNaN(+operatorInputArr[1])) {
          return parseInt(rowValue, 10) === parseInt(operatorInputArr[1], 10);
        } else {
          return isNaN(+rowValue) ? rowValue.toLowerCase() === operatorInputArr[1] : rowValue === operatorInputArr[1];
        }
      }
      default: {
        return rowValue.toString().toLowerCase().indexOf(input) !== -1 || !input;
      }
    }
  }

}



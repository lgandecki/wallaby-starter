import _ from 'underscore';

export function compareObjects(object1, object2) {
  const diff = [];
  diff.push(...objectComparer(object1, object2));
  // diff.push(...objectComparer(object2, object1));
  console.log('diff', diff);
  return diff;
}

export default function objectComparer(object1, object2) {
  let _differences = [];
  const arrayPaths = getArrayPaths(object1);
  if (_.isEqual(object1, object2)) {
  } else if (arrayPaths) {
    _.each(object1, (value, key) => {
      if (_.isArray(value)) {
        _.each(value, (arrayItem) => {
          const matchFound = _.any(object2[key], (object2ArrayItem) => {
            return _.isEqual(object2ArrayItem, arrayItem);
          });
          if (!matchFound) {
            const query = getQueryFromPrimitiveValuesFor(arrayItem);
            const relevantObjectInSecondObject = _.findWhere(object2[key], query);
            if (relevantObjectInSecondObject) {
              _differences.push(...objectComparer(arrayItem, relevantObjectInSecondObject));
            } else {
              _differences.push(`object2 doesn't contain ${JSON.stringify(arrayItem)}`)
            }
          }
        })
      } else {
        console.log('value', value);
        console.log('_.keys(object2)', _.keys(object2));
        if (object2.hasOwnProperty(key)) {
          console.log('object2[key]', object2[key]);
          _differences.push(...objectComparer(value, object2[key]));
        } else {
          _differences.push(`object2 doesn't contain ${key}`);
        }
      }
    })
  }
  
  return _differences;
}

export function getArrayPaths(object, parentKey = '') {
  const arrayPaths = [];
  _.each(object, (value, key) => {
    if (_.isArray(value)) {
      arrayPaths.push(getParentKey(key));
        arrayPaths.push(...getArrayPaths(value, getParentKey(key)));
    } else if (_.isObject(value)) {
      arrayPaths.push(...getArrayPaths(value, getParentKey(key)));
    }
  });
  
  return arrayPaths;
  
  function getParentKey(key) {
    return `${parentKey}${parentKey ? '.' : ''}${key}`;
  }
}

export function getQueryFromPrimitiveValuesFor(object) {
  query = {};
  _.each(object, (value, key) => {
    if (isPrimitive(value)) {
      query[key] = value;
    }
  });
  return query;
}

function isPrimitive(value) {
  return _.isString(value) || _.isNumber(value);
}
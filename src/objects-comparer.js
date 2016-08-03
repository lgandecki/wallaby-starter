import _ from 'underscore';

export function compareObjects(object1, object2) {
  const diff = [];
  diff.push(...objectComparer(object1, object2));
  diff.push(...objectComparer(object2, object1));
  return diff;
}

export default function objectComparer(object1, object2, parentKey = '') {
  let _differences = [];
  const arrayPaths = getArrayPaths(object1);
  if (_.isEqual(object1, object2)) {
    
  } else if (isPrimitive(object1)) {
    if (!_.isEqual(object1, object2)) {
      _differences.push(`object1 value: ${object1} is different from object2 value: ${object2} at path ${parentKey}`)
    }
  } else if (arrayPaths) {
    !_.isString(object1) && _.each(object1, (value, key) => {
      if (_.isArray(value)) {
        _.each(value, (arrayItem, arrayIndex) => {
          const matchFound = _.any(object2[key], (object2ArrayItem) => {
            return _.isEqual(object2ArrayItem, arrayItem);
          });
          if (!matchFound) {
            const query = getQueryFromPrimitiveValuesFor(arrayItem);
            const relevantObjectInSecondObject = _.findWhere(object2[key], query);
            if (relevantObjectInSecondObject) {
              _differences.push(...objectComparer(arrayItem, relevantObjectInSecondObject, getParentKey(parentKey, `${key}.${arrayIndex}`)));
            } else {
              _differences.push(`object2 doesn't contain ${JSON.stringify(arrayItem)} at path ${getParentKey(parentKey, key)}`)
            }
          }
        })
      } else {
        if (object2.hasOwnProperty(key)) {
          _differences.push(...objectComparer(value, object2[key], getParentKey(parentKey, key)));
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
      arrayPaths.push(getParentKey(parentKey, key));
        arrayPaths.push(...getArrayPaths(value, getParentKey(parentKey, key)));
    } else if (_.isObject(value)) {
      arrayPaths.push(...getArrayPaths(value, getParentKey(parentKey, key)));
    }
  });
  
  return arrayPaths;
}

function getParentKey(parentKey, key) {
  return `${parentKey}${parentKey ? '.' : ''}${key}`;
}

export function getQueryFromPrimitiveValuesFor(object) {
  const query = {};
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
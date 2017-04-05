import Promise from 'promise-polyfill'

Promise.any = function(arrayOfPromises) {
  if(!arrayOfPromises || !(arrayOfPromises instanceof Array)) {
    throw new Error('Must pass Promise.any an array')
  }
    
  if(arrayOfPromises.length === 0) {
    return Promise.resolve([])
  }
   
    
  // For each promise that resolves or rejects, 
  // make them all resolve.
  // Record which ones did resolve or reject
  var resolvingPromises = arrayOfPromises.map(function(promise) {
    return promise.then(function(result) {
      return {
        resolve: true,
        result: result
      }
    }, function(error) {
      return {
        resolve: false,
        result: error
      }
    })
  })

  return Promise.all(resolvingPromises).then(function(results) {
    // Count how many passed/failed
    var passed = [], failed = [], allFailed = true
    results.forEach(function(result) {
      if(result.resolve) {
        allFailed = false
      }
      passed.push(result.resolve ? result.result : null)
      failed.push(result.resolve ? null : result.result)
    });

    if(allFailed) {
      throw failed
    } else {
      return passed
    }
  })
}

export default Promise
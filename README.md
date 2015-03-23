
# angular-bbc-ld
Angular module for BBC Linked Data.


## Set up
First of include the file bbcld.module.js in your project, this will register the module allowing the services to cling on to it. The module has been developed so that you only have to include the modules you want to use.


## Usage
The usage is simple.

```javascript
module.method(_options_)
```

The module returns a promise when called, this the native way Angular keeps track of Asynchronous requests. To bind something to the result, use the `.then(succesFunction, failFunction)` method, specifying the function it should perform if it succeeds in the first argument and it's failure in the second. The success and failure functions take one argument, `data`, which is an object containing all the information related to the HTTP request inherited from ngHttp (`$http`).

```javascript
module.method(_options_).then(_successFunction_, _failureFunction_);
```

### Example:
```javascript
$scope.responses = [];
var success = function(data) {
    $log.info(data);
    $scope.responses.push(data);
};
var fail = function(data) {
    $log.error(data);
    $scope.responses.push(data);
};
juicer3.findThingCoOccurrencesMultiHop({
    type: 'http://dbpedia.org/ontology/Person',
    joinPredicate: 'http://dbpedia.org/ontology/party',
    joinObject: 'http://dbpedia.org/resource/Labour_Party_(UK)',
    uri: 'http://dbpedia.org/resource/Len_McCluskey',
    afterDate: '2015-01-01'
}).then(success, fail);
```




## Module: Juicer
Returns: JSON objects or JavaScript array's
Include: `juicer.service.js`

#### Settings Set Up
```javascript
angular
    .module('app')
    .constant('juicersettings', {
    apikey: APIKEY,
    host: 'http://data.test.bbc.co.uk/bbcrd-juicer/'
    });
```

#### Get articles
```javascript
juicer.getArticles({_params_})
```

`query`:
keywords to search for. Searches in title, description and body of the article.

`sources`:
scopes the results to certain sources. Multiple products can be specified by adding multiple sources[] values. The parameter is a number that correspond to a source id.

`facets`:
filter the results by facets. The facets parameter is a URL-Encoded resource from dbpedia. Multiple facets can be specified by adding multiple facets[] keys and values. The parameter is a string and it refers to a dbpedia resource.

`size`:
number of results to be returned. The parameter is a number.

`offset`:
number of results to skip. It can be used with size for pagination. The parameter is a number.

`publishedAfter`:
fetch articles published after a date. The date format is in UTC. Ex: 2015-02-02T00:00:00.000Z.

`publishedBefore`:
fetch articles published before a date. The date format is in UTC. Ex: 2015-02-02T00:00:00.000Z.

`recentFirst`:
Sort results by date (with most recent first) instead of by relevance to keywords. The parameter can be either yes or empty.

`likeText`:
Return a list of articles with a text similar to the parameter. The like-text parameter is a string.

`likeIds`:
Return a list of articles similar to other articles. The parameter is a string (internal id).

#### Get Article
```javascript
juicer.getArticle(_juicer UUID or URL_)
```

`query`:
Keyword to search for. It searches in the article. Can be a Juicer UUID or a URL

#### Get Article By ID
```javascript
juicer.getArticleById(_juicer UUID_)
```

Get the article directly from the endpoint by passing the ID

#### Get Article By URL
```javascript
juicer.getArticleByUrl(_URL_)
```

The Juicer ID of every article is derived from a SHA1 hash, So if we pass the URL to a SHA generator, we will probs get a valid Juicer ID.

#### Get Sources

```javascript
juicer.getSources({_params_})
```

`query`:
Keyword to search for. It searches in name of the source.


## Module: Triplestore
Returns: JSON-LD
Include: `juicer3.service.js`
Dependencies: `angular-sha1`

### Settings Set Up
```javascript
.module('app')
.constant('juicer3settings', {
apikey: APIKEY,
host: 'http://data.test.bbc.co.uk/v1/bbcrd-newslabs/'
});
```

#### Get Thing
```javascript
juicer3.getThing({_params_})
```

`uri`:
The URI of the thing to retrieve

`limit`:
integer - max number of creative works to return

`createdBy`:
URI - optional filter associated creative works by the NewsService (source) they were createdBy


#### Find Things Multi-hop
```javascript
juicer3.findThingsMultiHop({_params_})
```

Finds things in the knowledge base. Useful for building typeahead fields to find things. Use a multihop join to find things via some relationship in the wider DBpedia knowledge graph.
Typical use-case is for type-ahead find widgets


`query`:
string - optional a full text search term

`limit`:
integer - max num of suggestions to return

`type`:
optional URI defining the ontology class to filter things on - multiple types can be specified

`joinPredicate`:
optional predicate URI from DBpedia ontology that concepts found will be joined with

`joinObject`:
optional thing URI from DBpedia ontology that concepts found will be joined with via the join-predicate

#### Find Creative Works
```javascript
juicer3.findCreativeWorks({_params_})
```

A semantic search for creative work using tagged concepts

`tag`:
URI of a concept - multiple tag parameters can be used

`tagOperation`:
{and | or | fingerprint} The operations to apply to the supplied tags. Default is 'and'. 'fingerprint' returns creative works best matching the set of tags supplied. (Warning fingerprint search is not fast!)

`beforeDate`:
optional date in YYYY-MM-DD format defining the date before which articles were published

`afterDate`:
optional date in YYYY-MM-DD format defining the date after which articles were published

`createdBy`:
optionally filter by NewsService (source) using cwork:createdBy URIs

`limit`:
integer - max number of articles to return, default 10

`offset`:
integer - offset to start results from to allow for paging / infinite scroll

#### Find Creative Works Multi Hop
```javascript
juicer3.findCreativeWorksMultiHop({_params_})
```

A multi-hop semantic search for creative work via the graph of tagged concepts
The DBpedia ontology is used extensively as abacking knowledge graph. All classes and predicates from this ontollogy are exposed. See: http://dbpedia.org/ontology

`aboutTagType`:
Ontology class URI, find creative works by the type (class) of thing they are tagged with, eg http://dbpedia.org/ontology/Person

`aboutTagPredicate`:
Ontology predicate URI - find creative works tagged with concepts that have wider associations with this predicate. eg http://dbpedia.org/ontology/party

`aboutTagObject`:
Concept URI - find creative works tagged with concepts that have wider associations where the about-tag-predicate is associated with this object/concept. eg http://dbpedia.org/resource/ConservativeParty(UK)

`tag`:
URI of a concept - multiple tag parameters can be used

`tagOperation`:
{and | or | fingerprint} The operations to apply to the supplied tags. Default is 'and'. 'fingerprint' returns creative works best matching the set of tags supplied. (Warning fingerprint search is not fast!)

`beforeDate`:
optional date in YYYY-MM-DD format defining the date before which articles were published

`afterDate`:
optional date in YYYY-MM-DD format defining the date after which articles were published

`createdBy`:
optionally filter by NewsService (source) using cwork:createdBy URIs

`limit`:
integer - max number of articles to return, default 10

`offset`:
integer - offset to start results from to allow for paging / infinite scroll

#### Find Creative Works Geospatial
```javascript
juicer3.findCreativeWorksGeospatial({_params_})
```

A geospatial semantic search for creative work. Finds creative works tagged with places with a radius of a supplied latitude and longitude.

`point`:
{lat,long}, eg: 51.5,-1.0

`radius`:
{Nmi|km}, eg 10mi , 20km

`tag`:
URI of a concept - multiple tag parameters can be used

`tagop`:
{and | or | fingerprint} The operations to apply to the supplied tags. Default is 'and'. 'fingerprint' returns creative works best matching the set of tags supplied. (Warning fingerprint search is not fast!)

`beforeDate`:
optional date in YYYY-MM-DD format defining the date before which articles were published

`afterDate`:
optional date in YYYY-MM-DD format defining the date after which articles were published

`createdBy`:
optionally filter by NewsService (source) using cwork:createdBy URIs

`limit`:
integer - max number of articles to return, default 10

`offset`:
integer - offset to start results from to allow for paging / infinite scroll

#### Find Creative Works Geospacial Multi-hop
```javascript
juicer3.findCreativeWorksGeoMultiHop({_params_})
```

Combining geospatial with graph search.
A geospatial multi-hop semantic search for creative work via the graph of tagged concepts within a radius of some location.


`point`:
{lat,long}, eg: 51.5,-1.0

`radius`:
{Nmi|km}, eg 10mi , 20km

`aboutTagType`:
Ontology class URI, find creative works by the type (class) of thing they are tagged with, eg http://dbpedia.org/ontology/Person

`aboutTagPredicate`:
Ontology predicate URI - find creative works tagged with concepts that have wider associations with this predicate. eg http://dbpedia.org/ontology/party

`aboutTagObject`:
Concept URI - find creative works tagged with concepts that have wider associations where the about-tag-predicate is associated with this object/concept. eg http://dbpedia.org/resource/ConservativeParty(UK)

`tag`:
URI of a concept - multiple tag parameters can be used

`tagOperation`:
{and | or | fingerprint} The operations to apply to the supplied tags. Default is 'and'. 'fingerprint' returns creative works best matching the set of tags supplied. (Warning fingerprint search is not fast!)

`beforeDate`:
optional date in YYYY-MM-DD format defining the date before which articles were published

`afterDate`:
optional date in YYYY-MM-DD format defining the date after which articles were published

`createdBy`:
optionally filter by NewsService (source) using cwork:createdBy URIs

`limit`:
integer - max number of articles to return, default 10

`offset`:
integer - offset to start results from to allow for paging / infinite scroll

#### Find Tagged Things Multi-hop
```javascript
juicer3.findTaggedThingsMultiHop({_params_})
```

Finds things in the knowledge base using a full text search term. Useful for building type ahead fields to find things. Returns only things that have been tagged on creative works. Use a multihop join to find concepts via some relationship in the wider DBpedia knowledge graph.
Typical use-case is for type-ahead find widgets

`query`:
string - optional -a full text search term

`limit`:
integer - max num of suggested things to return

`type`:
optional URI defining the ontology class to filter things on - multiple types can be specified

`joinPredicate`:
optional predicate URI from DBpedia ontology that things found will be joined with

`joinObject`:
optional concept URI from DBpedia ontology that concepts found will be joined with via the join-predicate

#### Find Things Occurrences Multi-hop
```javascript
juicer3.findThingsOccurrencesMultiHop({_params_})
```

Finds most frequently tagged things in the knowledge base.

`limit`:
integer - max num of things to return

`type`:
optional/multiple URI defining the ontology class to filter things on

`beforeDate`:
date in YYYY-MM-DD format defining the date before which tag frequencies should be calculated

`afterDate`:
date in YYYY-MM-DD format defining the date after which tag frequencies should be calculated

`joinPredicate`:
optional predicate URI from DBpedia ontology that things found will be joined with

`joinObject`:
optional thing URI from DBpedia ontology that things found will be joined with via the join-predicate

#### Find Things Co-occurrences Multi-hop
```javascript
juicer3.findThingsCoOccurrencesMultiHop({_params_})
```

Finds most frequently tagged things in the knowledge base, co-occurring with a supplied thing

`uri`:
URI of a thing to find co-occurrences with

`limit`:
integer - max num of things to return

`type`:
optional/multiple URI defining the ontology class to filter things on

`beforeDate`:
date in YYYY-MM-DD format defining the date before which tag frequencies should be calculated

`afterDate`:
date in YYYY-MM-DD format defining the date after which tag frequencies should be calculated

`joinPredicate`:
optional predicate URI from DBpedia ontology that things found will be joined with

`joinObject`:
optional thing URI from DBpedia ontology that things found will be joined with via the join-predicate

## Module: BBC Things

`BBC Things does not support CORS, so it wont work in any browser!!!`

Returns: JSON-LD
Include: `things.service.js`

## Module: LDP & CANDY

`Have not yet been developed, so are just shim's for now`


## Dependencies
The Juicer module depends on `angular-sha1` for doing a reverse lookup for URL's in the Juicer.


## Test & development
Run `grunt` for building and `grunt serve` for preview, the app that will load up is the app from `app/` and will do all the calls to available endpoints returning the results on the screen.

`The test is now missing an environment`

You can add an environment with for example an `env.js` file

```javascript
angular
    .module('angularBbcLdApp')
    .constant('juicersettings', {
        apikey: APIKEY,
        host: 'http://data.test.bbc.co.uk/bbcrd-juicer/'
    })
    .constant('juicer3settings', {
        apikey: APIKEY,
        host: 'http://data.test.bbc.co.uk/v1/bbcrd-newslabs/'
    });
```


## Testing
Unit tests are not yet written
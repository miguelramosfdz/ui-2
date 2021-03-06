---
layout: page
title: "HTTP"
category: middleware
date: 2017-02-28 10:18:21
order: 3
---

## Description
The HTTP middleware is loaded by default. It manages the HTTP methods
* OPTIONS
* GET
* HEAD
* PATCH
* POST
* PUT
* DELETE
* TRACE
* CONNECT

It will intercept those actions, but **keep in mind that the easiest way to use it is through the `HTTP actions utility`** (see below) :
```javascript
const action = {
    type: 'POST', // or one of the HTTP methods
    body: {
        .. // the optional body to send
    },
    transform(jsonResponse) {
        ... // the optional transformation to perform on the response before dispatch
    },
    onSend: 'MY_REQUEST_SENT', // the optional action type to dispatch on fetch
    onError: 'MY_REQUEST_ERROR', // the optional action or action creator to dispatch on fetch error
    onResponse: 'MY_REQUEST_RESPONSE', // the optional action or action creator to dispatch on fetch complete
}
dispatch(action);
```

| Argument | Type | Description | Mandatory |
|---|---|---|---|
| type | string | One of the supported HTTP methods. | true |
| body | object | The body to send. | false |
| transform | function | The transformation method to call on response, to adapt it before dispatch. | false |
| onSend | string | The action type to dispatch before fetch. This is optional but CMF will still dispatch an `@@HTTP/REQUEST` action on every request. By providing this option, CMF will dispatch an action for your specific case after the global one. | false |
| onError | string &#124; function | The action or action creator to dispatch on fetch error. This is optional because all http error will trigger an `@@HTTP/ERRORS` action with error details. By providing this option, CMF dispatch an action for your specific case after the global one.| false |
| onResponse | string &#124; function | The action or action creator to dispatch on fetch complete. CMF will still dispatch an `@@HTTP/RESPONSE` action on each response, with the original response (before `transform`). | false |

## Timeline Process
* dispatch `@@HTTP/REQUEST` (with the action)
* dispatch `action.onSend` (with the action) if provided
* execute the request with fetch api
* check the status, and execute the error process when status is not in [200, 300[
* transform response to json
* dispatch `@@HTTP/RESPONSE`
* transform the response with `action.transform(response)` if provided
* dispatch `action.onResponse` if provided
* continue the original action dispatch, enhanced with the response. This is useful with [collection management]({{ site.baseurl }}{% link _posts/2017-02-28-how-to-manage-collections-.md %}) for example. 

# Http actions
CMF exposes utilities to ease the use of the HTTP middelware.
 
```javascript
import { actions } from 'react-cmf';

export function fetchDataSets() {
	return actions.http.get('/remote/datasets', {
		onSend: GETTING_DATASETS,
		onError: ERROR_GETTING_DATASETS,
		transform(data) {
			return data.map((row) => {
				const { datastore, ...rest } = row;
				return {
					datastore: datastore.label,
					...rest,
				};
			});
		},
	});
}

...

dispatch(fetchDataSets());
```

### actions.http.get(url, config)

| Argument | Type | Description | Mandatory |
|---|---|---|---|
| url | string | The GET url | true |
| config | object | The rest of action configuration. | false |

### actions.http.post(url, data, config)

| Argument | Type | Description | Mandatory |
|---|---|---|---|
| url | string | The POST url | true |
| data | object | The POST body url | false |
| config | object | The rest of action configuration. | false |

### actions.http.delete(url, config)

| Argument | Type | Description | Mandatory |
|---|---|---|---|
| url | string | The DELETE url | true |
| config | object | The rest of action configuration. | false |

### actions.http.patch(url, data, config)

| Argument | Type | Description | Mandatory |
|---|---|---|---|
| url | string | The PATCH url | true |
| data | object | The PATCH body url | false |
| config | object | The rest of action configuration. | false |

### actions.http.put(url, data, config)

| Argument | Type | Description | Mandatory |
|---|---|---|---|
| url | string | The PUT url | true |
| data | object | The PUT body url | false |
| config | object | The rest of action configuration. | false |

### actions.http.head(url, config)

| Argument | Type | Description | Mandatory |
|---|---|---|---|
| url | string | The HEAD url | true |
| config | object | The rest of action configuration. | false |

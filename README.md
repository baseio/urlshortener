# urlshortener
simple url shortener service


## Shorten URL

`$ curl -X PUT http://go.fndn.dk/https://google.com`

(read as `http://go.fndn.dk/{target}`, where `{target}` is the (long) url you wish to shorten.

response:
`{"status":"ok","code":"N1Hcl6x1g","url":"http://go.fndn.dk/N1Hcl6x1g"}`


## Expand / Rewrite

`$ curl http://go.fndn.dk/4kRWZaeke` or  
<a href="http://go.fndn.dk/4kRWZaeke">4kRWZaeke</a> (`<a href="http://go.fndn.dk/4kRWZaeke">4kRWZaeke</a>`)

will rewrite/redirect to the target.


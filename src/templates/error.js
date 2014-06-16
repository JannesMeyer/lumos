exports.render = function(err) {
    return (

`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Error</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/images/favicon.png">
</head>
<body>
<h1>${err.status || ''} ${err.message}</h1>
<pre>${err.stack}</pre>
</body>
</html>`

    );
}

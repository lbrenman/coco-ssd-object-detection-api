# Tensorflow COCO-SSD Image Object Detection API using NodeJS/Express

https://www.npmjs.com/package/@tensorflow-models/coco-ssd

## Install

* Check out code from repo
* Run `npm install`

## Set Environment Vars

You can create a .env file with the following:

```
API_KEY={{YOUR FRONT END API KEY}}
PORT={{PORT TO RUN ON}}
```

## Run

`node index.js`

## Call API

```bash
curl --location 'http://localhost:3000/detect' \
--header 'Content-Type: application/json' \
--header 'x-api-key: {{YOUR API KEY}}' \
--data '{
	"image": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIcSUNDX1BST0ZJTEUAAQEAAA...HFTtbiPCiSTAHrRoAiJsv/Z"
}'
```

with Response:

```json
{
    "success": true,
    "predictions": [
        {
            "class": "car",
            "score": 0.9508237838745117,
            "bbox": [
                29.981911182403564,
                565.6827092170715,
                1406.7764282226562,
                619.4406151771545
            ]
        }
    ]
}
```

## Other Responses

500
{
  "error": "Model not loaded yet"
}

{
  "error": "Error processing image"
}

400
{
  "error": "No image provided"
}

{
  "error": "Invalid base64 image data"
}

## Health Check

```bash
curl --location 'http://localhost:3000/health' \
--header 'Content-Type: application/json' \
--header 'x-api-key: {{YOUR API KEY}}'
```

with response:

```json
{
    "status": "ok",
    "modelLoaded": true
}
```
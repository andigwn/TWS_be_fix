# Kamar API Spec

## Create Kamar API
Endpoin POST /api/kos/:kosId/kamars

Headers :
- Authorization : token 

Request Body :
```json
{
    "nomor_kamar": "kamar 1",
    "harga": 100000,
    "fasilitas": "AC, TV, Kulkas",
    "image": "kamar.png"

}
```
Response Body Success:
```json
{
    "data": {
        "id": 1,
        "nomor_kamar": "kamar 1",
        "harga": 100000,
        "fasilitas": "AC, TV, Kulkas",
        "image": "kamar.png"
    }
}
```

Response Body Error:
```json
{
    "errors": "Data invalid"
}

```

## Update Kamar API
Endpoin PUT /api/kos/:kosId/kamars/:kamarsId

Headers :
- Authorization : token 

Request Body :
```json
{
    "nomor_kamar": "kamar 1",
    "harga": 100000,
    "fasilitas": "AC, TV, Kulkas",
    "image": "kamar.png"
}
```

Response Body Success:
```json
{
    "data": {
        "id": 1,
        "nomor_kamar": "kamar 1",
        "harga": 100000,
        "fasilitas": "AC, TV, Kulkas",
        "image": "kamar.png"
    }
}
```

Response Body Error:
```json
{
    "errors": "Data invalid"
}

```

## Get Kamar API
Endpoin GET /api/kos/:kosId/kamars/:kamarsId

Headers :
- Authorization : token 

Response Body Success:
```json
{
    "data": {
        "id": 1,
        "nomor_kamar": "kamar 1",
        "harga": 100000,
        "fasilitas": "AC, TV, Kulkas",
        "image": "kamar.png"
    }
}
```

Response Body Error:
```json
{
    "errors": "Data not found"
}

```

## List Kamar API
Endpoin GET /api/kos/:kosId/kamars

Headers :
- Authorization : token 


Response Body Success:
```json
{
    "data" : [
        {
            "id": 1,
            "nomor_kamar": "kamar 1",
            "harga": 100000,
            "fasilitas": "AC, TV, Kulkas",
            "image": "kamar.png"
        },
        {
            "id": 2,
            "nomor_kamar": "kamar 1",
            "harga": 100000,
            "fasilitas": "AC, TV, Kulkas",
            "image": "kamar.png"
        },
    ]
}
```

Response Body Error:
```json
{
    "errors": "Data not found"
}

``` 

## Delet Kamar API
Endpoin DELETE /api/kos/:kosId/kamars/:kamarsId

Headers :
- Authorization : token 



Response Body Success:
```json
{
    "data": "OK"
}
```

Response Body Error:
```json
{
    "errors": "Data not found"
}

```
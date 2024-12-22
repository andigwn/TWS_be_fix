# Kos API Spec

## Create Kos API

Endpoint CREATE /api/kos/ 

Headers :
- Authorization : token

Request Body :
```json
{
    "nama_kos" : "HR kos",
    "pemilik_kos" : "bapak blablabla",
    "alamat_kos" : "Jl. HR",
    "description": "kos murah",
    "image": "kos.png"
}
```
Response Body Success:
```json
{
    "data": {
        "id": 1,
        "nama_kos" : "HR kos",
        "pemilik_kos" : "bapak blablabla",
        "alamat_kos" : "Jl. HR",
        "description": "kos murah",
        "image": "kos.png"
    }
}
```
Response Body Error:
```json
{
    "errors": "Nama Kos already by other kos",
}
```

## Update Kos API
Endpoint PUT /api/kos/:kosId

Headers 
- Authorization : token

Request Body:
```json
{
    "nama_kos" : "HR kos baru", 
    "pemilik_kos" : "bapak blablabla",
    "alamat_kos" : "Jl. HR baru",
    "description": "kos murah",
    "image": "kos.png"
}
```
Response Body Success:
```json
{
    "data": {
        "id": 1,
        "nama_kos" : "HR kos baru", 
        "pemilik_kos" : "bapak blablabla",
        "alamat_kos" : "Jl. HR baru",
        "description": "kos murah",
        "image": "kos.png"
    }
}
```

Response Body Error:
```json
{
    "errors": "Data not null",
}
```

## Get Kos API 
Endpoint GET /api/kos/:kosId

Headers 
- Authorization

Response Body Success:
```json
{
    "data": {
        "id": 1,
        "nama_kos" : "HR kos baru", 
        "pemilik_kos" : "bapak blablabla",
        "alamat_kos" : "Jl. HR baru",
        "description": "kos murah",
        "image": "kos.png"
    }
}
```
Response Body Error:
```json
{
    "errors": "Data not found", 
}
```


## Search Kos API
Endpoint GET /api/kos/

Headers : 
- Authorization

Query Params : 
- nama_kos : search by nama kos, using like, optional 
- pemilik_kos : search by pemilik kos, using like, optional
- alamat_kos : search by alamat kos,using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :
```json
{
    "data": [
        {
            "id": 1,
            "nama_kos" : "HR kos baru", 
            "pemilik_kos" : "bapak blablabla",
            "alamat_kos" : "Jl. HR baru",
            "description": "kos murah",
            "image": "kos.png"
        },
        {
            "id": 2,
            "nama_kos" : "HR kos baru", 
            "pemilik_kos" : "bapak blablabla",
            "alamat_kos" : "Jl. HR baru",
            "description": "kos murah",
            "image": "kos.png"
        }
    ],
    "paging":{
        "page": 1,
        "total_page":3,
        "total_items": 30
    }
}
```
## Delete Kos API

Endpoint DELETE /api/kos/:kosId

Headers 
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
    "errors": "Data not found", 
}
```
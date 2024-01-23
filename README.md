# Inventory Management System


## how to run the app
npm run build

npm run dev

## when making a change in schema how to migrate the changes

npx prisma generate
npx prisma db push


## creating store api
    method: post
    url: http://localhost:3000/api/stores
    request: {
        "name": "master"
    }

    response:
    {
        "id":"0f10d1aa-9255-4f1a-aaa9-bce2747476ec",
        "name":"master",
        "createdAt":"2024-01-22T12:36:45.709Z",
        "updatedAt":"2024-01-22T12:36:45.709Z"
    }

## register user
    method: post
    url: http://localhost:3000/api/user
    request: 
    {
        "username": "admin",
        "password": "admin",
        "email": "admin@gmail.com",
        "storeId": "0f10d1aa-9255-4f1a-aaa9-bce2747476ec",
        "role": "admin"
    }

    response:
    {
        "id":"a6c926d8-9806-4586-af1e-2eaefc07ad3f",
        "username":"admin",
        "email":"admin@gmail.com",
        "role":"admin",
        "storeId":"0f10d1aa-9255-4f1a-aaa9-bce2747476ec",
        "createdAt":"2024-01-22T12:41:53.702Z",
        "updatedAt":"2024-01-22T12:41:53.702Z"
    }
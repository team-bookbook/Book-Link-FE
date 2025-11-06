실시간 카메라 스캔으로 바코드 인식 => 바코드 내에서 ISBN 코드 추출 => ISBN 인식 성공시 /api/book/{isbn} 요청

요청받은 내용 데이터가 아예 없는 경우

1. 하단 도서 미리보기에서 수동입력이 필요함을 알림
2. book-create 페이지 이동, 빈 폼에서 수동으로 값을 입력받도록
3. 제출 버튼 클릭 동작

- 3.1 /api/book post요청을 통한 도서 등록
- 3.2 등록 성공시 등록한 isbn으로 /api/book/{isbn} get 요청을 통해 다시 도서 아이디 받기
- 3.3 도서 아이디와 썸네일 이미지, 가격등을 결합해 /api/library-book post요청을 통한 도서관 도서 등록

요청받은 내용 데이터가 있는 경우

1. 하단 도서 미리보기에서 요청받은 내용 데이터를 보여줌
2. 사용자가 확인하고 맞다면 book-create 페이지 이동
3. 요청받은 데이터를 토대로 입력 폼 미리 채워두기
4. 제출 버튼 클릭 동작

- 4.1 도서 아이디와 썸네일 이미지, 가격등을 결합해 /api/library-book post요청을 통한 도서관 도서 등록

POST /api/book 도서 등록

기존 DB에 없던 도서를 등록합니다.

Parameters Try it out Name Description Trace-Id \* string (header) Trace-Id Request body

application/json Example Value Schema { "title": "마흔에 읽는 쇼펜하우어", "author": "강용수", "publisher": "유노북스",
"category": "000", "originalPrice": 17000, "publishedDate": "2025-11-06", "isbn": "string", "ISBN": "9791192300818" }
Responses Code Description Links 200 OK

Media type

_/_ Controls Accept header. Example Value Schema { "success": true, "data": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
"error": null }

GET /api/book/{isbn} 도서 검색

도서를 검색합니다. 기존 DB에 없을 시 국립중앙도서관 api를 이용해 카테고리 제외한 정보를 반환합니다.

Parameters Try it out Name Description isbn _ string (path) isbn Trace-Id _ string (header) Trace-Id Responses Code
Description Links 200 OK

Media type

_/_ Controls Accept header. Example Value Schema { "success": true, "data": { "id":
"550e8400-e29b-41d4-a716-446655440000", "title": "마흔에 읽는 쇼펜하우어", "author": "강용수", "publisher": "유노북스",
"category": "GENERALITIES", "originalPrice": 17000, "publishedDate": "2025-09-22", "foundInNationalLibrary": true,
"isbn": "string" }, "error": null }

POST /api/library-book 도서 등록

도서관에 새로운 도서를 등록합니다. 하나의 도서관당 동일 도서는 한 번만 등록 가능합니다.

Parameters Try it out Name Description Trace-Id \* string (header) Trace-Id Request body

application/json Example Value Schema { "id": "550e8400-e29b-41d4-a716-446655440000", "copies": 2, "deposit": 1000,
"previewImages":
"[https://bookbook-booklink.s3.ap-northeast-2.amazonaws.com/doinlkxjoi-di9u09/library-book-images/image.jpg]" }
Responses Code Description Links 200 OK

Media type

_/_ Controls Accept header. Example Value Schema { "success": true, "data": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
"error": null }

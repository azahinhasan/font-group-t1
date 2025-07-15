# font-group-t1

=== Font Upload (form-data, NOT JSON) ===
POST /font
- form data type
- KEY: font (type: File) → select .ttf file


=== Create Font Group ===
POST /font-group
Content-Type: application/json

{
  "name": "My Font Group",
  "fonts": ["64ff88d9f534b86a4f57a901", "64ff88d9f534b86a4f57a902"]
}

=== Update Font Group ===
PUT /font-group/64ff9a01f534b86a4f57a9ff

{
  "name": "Updated Font Group Name",
  "fonts": ["64ff88d9f534b86a4f57a901", "64ff88d9f534b86a4f57a903"]
}

=== Example for GET Requests ===
GET /font
GET /font-group

=== Example for DELETE Requests ===
DELETE /font/64ff88d9f534b86a4f57a901
DELETE /font-group/64ff9a01f534b86a4f57a9ff

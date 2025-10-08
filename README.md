# inspeksi

---

### **articles**

* `id` → bigint, NOT NULL
* `type` → text, NOT NULL
* `title` → text, NOT NULL
* `published_at` → date, NOT NULL
* `image_url` → text, NULL
* `content` → ARRAY, NOT NULL
* `created_at` → timestamptz, NULL
* `views` → bigint, NOT NULL, default `0`
* `shares` → bigint, NOT NULL, default `0`
* `likes` → bigint, NOT NULL, default `0`
* `excerpt` → text, NOT NULL, default `''`

---

### **content**

* `id` → bigint, NOT NULL
* `section` → text, NOT NULL
* `key` → text, NOT NULL
* `value` → text, NULL
* `created_at` → timestamptz, NULL
* `updated_at` → timestamptz, NULL

---

### **events**

* `id` → bigint, NOT NULL
* `title` → text, NOT NULL
* `event_date` → date, NOT NULL
* `location` → text, NOT NULL
* `map_url` → text, NULL
* `created_at` → timestamptz, NULL

---

### **faqs**

* `id` → uuid, NOT NULL
* `question` → text, NOT NULL
* `answer` → text, NOT NULL
* `created_at` → timestamptz, NULL

---

### **forms**

* `id` → bigint, NOT NULL
* `icon` → text, NULL
* `title` → text, NOT NULL
* `link` → text, NOT NULL
* `description` → text, NULL
* `is_active` → boolean, NULL
* `created_at` → timestamptz, NULL

---

### **opinion**

* `id` → bigint, NOT NULL
* `icon` → text, NOT NULL
* `title` → text, NOT NULL
* `description` → text, NOT NULL
* `created_at` → timestamptz, NULL

---

### **partners**

* `id` → bigint, NOT NULL
* `name` → text, NOT NULL
* `logo_url` → text, NOT NULL
* `created_at` → timestamptz, NULL

---

### **product_images**

* `id` → bigint, NOT NULL
* `product_id` → bigint, NULL
* `image_url` → text, NOT NULL
* `is_primary` → boolean, NULL

---

### **products**

* `id` → bigint, NOT NULL
* `name` → text, NOT NULL
* `description` → text, NULL
* `price` → numeric, NOT NULL
* `stock` → integer, NOT NULL
* `created_at` → timestamp, NULL

---

### **team_members**

* `id` → bigint, NOT NULL
* `name` → text, NOT NULL
* `position` → text, NOT NULL
* `image_url` → text, NULL
* `created_at` → timestamptz, NULL

---

### **testimonials**

* `id` → bigint, NOT NULL
* `text` → text, NOT NULL
* `author` → text, NOT NULL
* `location` → text, NULL
* `created_at` → timestamptz, NULL

---

### **users**

* `id` → uuid, NOT NULL
* `username` → text, NOT NULL
* `password` → text, NOT NULL
* `created_at` → timestamp, NULL

---

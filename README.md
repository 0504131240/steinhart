# Steinhart — אתר משפחתי

אפליקציית ווב (PWA) לניהול חיי המשפחה: אירועים משותפים וחלוקת עלויות, איזון תשלומים בין משפחות, קופות למטרה (כולל קופות למתנות), צ'אט משפחתי, לוח שנה לאירועים, וסקרים. מבוסס על אותה תשתית כמו אתר `yoo`, מותאם למשפחת שטיינהרט.

הנתונים נשמרים ב-Firebase Firestore. חלק מהפיצ'רים (התראות פוש, גיבוי יומי, תזכורת חובות שבועית) רצים כפונקציות שרת ב-Vercel (`api/`).

## תכונות

- **אירועים**: יצירת אירוע משותף, חלוקת עלות שווה או תשלום נפרד לכל משפחה
- **איזון**: חישוב אוטומטי של העברות נדרשות בין משפחות
- **ארכיון**: היסטוריית אירועים שנסגרו, מסונן לפי שנה
- **חובות**: תצוגת חובות פתוחים לכל משפחה + תזכורת שבועית אוטומטית באימייל/פוש
- **קופות למטרה**: הפקדות, משיכות והיסטוריה — לדוגמה קופה למתנה
- **צ'אט משפחתי** + התראות פוש
- **לוח שנה** לאירועי המשפחה
- **סקרים**
- **פאנל ניהול** (`admin.html`) נפרד מהתצוגה הרגילה (`index.html`)
- **PWA**: ניתן להוסיף למסך הבית במובייל
- **גיבוי יומי** אוטומטי + שחזור מהפאנל הניהולי

## הרצה מקומית

קובצי `index.html` / `admin.html` הם עמוד יחיד, ללא build. אפשר לפתוח ישירות בדפדפן או:

```bash
npx serve .
```

## מצב הגדרה נוכחי

ה-`firebaseConfig` באפליקציה (ב-`app.js` וב-`form.html`) כבר מוגדר לפרויקט Firebase שלכם: **`steinhart-ac7d6`**. אין צורך לגעת בזה, אלא אם תרצו לעבור לפרויקט אחר.

מה שכן **נשאר להשלים**:

### 1. Firestore — יצירת מסד נתונים

ב-[Firebase Console](https://console.firebase.google.com/project/steinhart-ac7d6) → Build → Firestore Database → Create database (production mode).

### 2. Firestore Security Rules

⚠️ **חשוב להבין**: האפליקציה לא משתמשת ב-Firebase Authentication — ה"סיסמה" שרואים בממשק היא בדיקה בצד לקוח בלבד (כל המשפחות רואות הכל, רק מי שמקליד את הסיסמה יכול *לערוך*). לכן חוקים שדורשים `request.auth != null` יחסמו הכל. במקום זה, מגבילים גישה בדיוק לארבעת האוספים (collections) שהקוד באמת משתמש בהם, כדי שאף אחד לא יוכל לגעת בנתונים אחרים בפרויקט:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appData/{docId} {
      allow read, write: if true;
    }
    match /formExpenses/{docId} {
      allow read, write: if true;
    }
    match /fcmTokens/{docId} {
      allow read, write: if true;
    }
    match /bdayNotifClaims/{docId} {
      allow read, write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

הגדרה אמיתית ברמת מסד הנתונים (רק מי שמכיר סיסמה יכול לכתוב, לא רק דרך הממשק) דורשת הוספת Firebase Authentication אמיתי לקוד — לא רק שינוי ב-Rules. אפשר להוסיף בעתיד אם תרצו.

### 3. Web Push (VAPID key) — להתראות פוש בדפדפן

Firebase Console → Project Settings → Cloud Messaging → Web configuration → Web Push certificates → Generate key pair. את המפתח שמתקבל יש להדביק ב-`app.js` במקום `YOUR_WEB_PUSH_VAPID_KEY`:

```js
const FCM_VAPID_KEY='...';
```

### 4. Vercel — משתני סביבה (ל-API של התראות/גיבויים/תזכורות)

ב-Vercel Project Settings → Environment Variables, מתוך Service Account שנוצר ב-Firebase Console → Project Settings → Service Accounts → Generate new private key:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (לשמור את ה-`\n` כמו שהם)

### 5. EmailJS (אופציונלי — לתזכורות חוב באימייל)

אם רוצים גם תזכורות באימייל ולא רק בפוש: ליצור חשבון ב-[EmailJS](https://www.emailjs.com/) ולשמור את הפרטים (public key, service id, template id) במסמך `settings/emailjs` ב-Firestore. בלי זה, תזכורות האימייל פשוט ידלגו (הפוש ימשיך לעבוד).

## הערה על תמונות

אייקון (ריבוע כחול עם "S") ולוגו (Steinhart + "משפחת שטיינהרט") זמניים, הוכנו אוטומטית כדי לא להעתיק תמונות אישיות מאתר משפחה אחרת. אפשר להחליף את `icon.jpg` ו-`logo.jpg` בתמונה/לוגו האמיתיים של המשפחה בכל שלב.

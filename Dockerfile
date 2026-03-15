
FROM node:20-alpine

# הגדרת תיקיית העבודה בתוך הקונטיינר
WORKDIR /app

# העתקת קבצי ההגדרות של ה-Packages
COPY package*.json ./
COPY prisma ./prisma/

# התקנת תלויות (Dependencies)
RUN npm install

# העתקת שאר קבצי הפרויקט
COPY . .

# בניית הפרויקט (Next.js Build)
RUN npx prisma generate
RUN npm run build

# חשיפת הפורט עליו רצה האפליקציה
EXPOSE 3000

# פקודת ההרצה
CMD ["npm", "start"]
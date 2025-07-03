# Zomigasports

This is a Next.js application for a live sports streaming website, scaffolded by Firebase Studio.

## Features

- **Live Match Streaming**: Watch live sports matches with a built-in HLS video player.
- **Dynamic Match List**: Browse a list of current and upcoming matches.
- **Multi-Channel Support**: Switch between multiple live channels.
- **Arabic Language Support**: The user interface is designed with RTL support.
- **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices.

To get started, run the development server:

```bash
npm run dev
```

Then open [http://localhost:9002](http://localhost:9002) to see the result.

## نشر التطبيق (Deployment)

تم إعداد هذا التطبيق ليتم نشره بسهولة على Firebase App Hosting. اتبع هذه الخطوات البسيطة لنشر تطبيقك على الإنترنت.

### المتطلبات الأساسية

تأكد من أن لديك `firebase-tools` مثبتة على جهازك وأنك قد سجلت الدخول. إذا لم تكن قد فعلت ذلك، قم بتشغيل الأوامر التالية في الطرفية (Terminal):

```bash
npm install -g firebase-tools
firebase login
```

### الخطوة 1: بناء التطبيق للإنتاج

قبل النشر، يجب بناء نسخة الإنتاج من تطبيقك. هذا الأمر يُجمّع ويُحسّن جميع ملفات التطبيق لتكون جاهزة للعمل على الخادم.

في الطرفية، تأكد من أنك في مجلد المشروع، ثم قم بتشغيل الأمر التالي:

```bash
npm run build
```

### الخطوة 2: نشر التطبيق

بعد انتهاء عملية البناء بنجاح، أنت الآن جاهز لنشر التطبيق. قم بتشغيل الأمر التالي في الطرفية:

```bash
firebase deploy
```

سيقوم Firebase CLI برفع وبناء ونشر تطبيقك. بعد اكتمال العملية، سيعطيك رابطًا مباشرًا لموقعك على الإنترنت. هذا كل شيء!

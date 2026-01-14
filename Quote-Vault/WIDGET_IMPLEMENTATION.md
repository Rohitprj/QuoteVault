# Widget Implementation Guide

This document explains how to implement native home screen widgets for the QuoteVault app. Since Expo managed workflow doesn't support native widgets, this requires ejecting to bare workflow or using a custom development client.

## Current Implementation

The app includes an in-app "Today" screen (`/today`) that mimics widget functionality and can be accessed via deep linking.

## Native Widget Implementation

### iOS WidgetKit Implementation

#### 1. Project Setup
```bash
# Eject from Expo managed workflow
npx expo eject

# Or use custom development client
npx expo run:ios --device
```

#### 2. Add Widget Target
1. Open `ios/QuoteVault.xcworkspace` in Xcode
2. File > New > Target > Widget Extension
3. Name it "QuoteVaultWidget"
4. Choose "WidgetKit" as the framework

#### 3. Widget Code (Swift)
Create `QuoteVaultWidget/QuoteVaultWidget.swift`:

```swift
import WidgetKit
import SwiftUI
import Intents

struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), quote: "Loading...", author: "QuoteVault")
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), quote: "The only way to do great work is to love what you do.", author: "Steve Jobs")
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        Task {
            // Fetch quote from your API
            let quote = await fetchQuoteOfTheDay()

            let entry = SimpleEntry(date: Date(), quote: quote.text, author: quote.author)
            let timeline = Timeline(entries: [entry], policy: .atEnd)
            completion(timeline)
        }
    }

    private func fetchQuoteOfTheDay() async -> (text: String, author: String) {
        // Implement API call to get quote of the day
        // For now, return a placeholder
        return ("The only way to do great work is to love what you do.", "Steve Jobs")
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let quote: String
    let author: String
}

struct QuoteVaultWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            LinearGradient(gradient: Gradient(colors: [Color.blue, Color.purple]),
                         startPoint: .topLeading,
                         endPoint: .bottomTrailing)

            VStack(spacing: 12) {
                HStack {
                    Image(systemName: "sparkles")
                    Text("Quote of the Day")
                        .font(.caption)
                        .fontWeight(.semibold)
                }
                .foregroundColor(.white.opacity(0.9))

                Text("\"\(entry.quote)\"")
                    .font(.system(size: 14, weight: .regular, design: .serif))
                    .italic()
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .lineLimit(4)

                HStack {
                    Rectangle()
                        .frame(width: 20, height: 1)
                        .foregroundColor(.white.opacity(0.8))
                    Text(entry.author)
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                }
            }
            .padding()
        }
    }
}

@main
struct QuoteVaultWidget: Widget {
    let kind: String = "QuoteVaultWidget"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
            QuoteVaultWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Quote of the Day")
        .description("Daily inspirational quotes")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
```

#### 4. Update Info.plist
Add to `QuoteVaultWidget/Info.plist`:

```xml
<key>NSExtension</key>
<dict>
    <key>NSExtensionPointIdentifier</key>
    <string>com.apple.widgetkit-extension</string>
</dict>
```

### Android App Widget Implementation

#### 1. Create Widget Provider
Create `android/app/src/main/java/com/quotevault/QuoteWidgetProvider.kt`:

```kotlin
package com.quotevault

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import androidx.work.*
import java.util.concurrent.TimeUnit

class QuoteWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }

        // Schedule daily updates
        scheduleDailyUpdate(context)
    }

    private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        val views = RemoteViews(context.packageName, R.layout.quote_widget)

        // Set default quote
        views.setTextViewText(R.id.quote_text, "\"The only way to do great work is to love what you do.\"")
        views.setTextViewText(R.id.quote_author, "— Steve Jobs")

        // Set up tap intent to open app
        val intent = Intent(context, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }

    private fun scheduleDailyUpdate(context: Context) {
        val workRequest = PeriodicWorkRequestBuilder<QuoteUpdateWorker>(24, TimeUnit.HOURS)
            .build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            "quote_update",
            ExistingPeriodicWorkPolicy.REPLACE,
            workRequest
        )
    }
}
```

#### 2. Create Worker for Updates
Create `android/app/src/main/java/com/quotevault/QuoteUpdateWorker.kt`:

```kotlin
package com.quotevault

import android.content.Context
import androidx.work.Worker
import androidx.work.WorkerParameters

class QuoteUpdateWorker(context: Context, workerParams: WorkerParameters) : Worker(context, workerParams) {

    override fun doWork(): Result {
        // Fetch new quote and update widgets
        // This would call your API to get the daily quote
        return Result.success()
    }
}
```

#### 3. Widget Layout
Create `android/app/src/main/res/layout/quote_widget.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@drawable/widget_background"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:id="@+id/quote_text"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:gravity="center"
        android:textColor="@android:color/white"
        android:textSize="14sp"
        android:textStyle="italic" />

    <TextView
        android:id="@+id/quote_author"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:textColor="@android:color/white"
        android:textSize="12sp"
        android:textStyle="bold" />

</LinearLayout>
```

#### 4. Widget Background
Create `android/app/src/main/res/drawable/widget_background.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <gradient
        android:angle="45"
        android:startColor="#667eea"
        android:endColor="#764ba2" />
    <corners android:radius="16dp" />
</shape>
```

#### 5. Update AndroidManifest.xml
```xml
<receiver android:name=".QuoteWidgetProvider">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/quote_widget_info" />
</receiver>
```

#### 6. Widget Info
Create `android/app/src/main/res/xml/quote_widget_info.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="180dp"
    android:minHeight="110dp"
    android:updatePeriodMillis="86400000"
    android:previewImage="@drawable/widget_preview"
    android:initialLayout="@layout/quote_widget"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen" />
```

### API Integration

For both platforms, you'll need to create an API endpoint that returns the daily quote:

```javascript
// Example API endpoint (/api/daily-quote)
app.get('/api/daily-quote', (req, res) => {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const totalQuotes = 105; // Your total number of quotes
  const quoteIndex = dayIndex % totalQuotes;

  // Fetch quote from database by index
  const quote = quotes[quoteIndex];

  res.json({
    text: quote.text,
    author: quote.author,
    category: quote.category
  });
});
```

### Testing

1. **iOS**: Add widget to home screen, verify it updates daily
2. **Android**: Add widget to home screen, verify it updates and opens app on tap

### Limitations

- Expo managed workflow doesn't support native widgets
- Requires bare workflow or custom development client
- iOS widgets update at system-determined intervals
- Android widgets can be updated more frequently but are subject to battery optimization

### Alternative Solutions

For the assignment, the in-app "Today" screen provides similar functionality and demonstrates understanding of widget concepts. The native implementations above show how to extend this to actual home screen widgets when time and project constraints allow.
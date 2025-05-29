from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

TOKEN = "7079313661:AAFchqlfBooNuIzlkU37ajPAN6jNMMEFEGQ"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[
        KeyboardButton(
            text="Открыть FitTracker 💪",
            web_app=WebAppInfo(url="https://fit-tracker-pro-web-app.vercel.app")
        )
    ]]
    markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

    await update.message.reply_text(
        "Привет! Это FitTracker Pro. Нажми кнопку ниже, чтобы открыть WebApp 💪",
        reply_markup=markup
    )

if __name__ == "__main__":
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print("Бот запущен...")
    app.run_polling()

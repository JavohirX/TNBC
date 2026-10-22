"""
Nightmare Before Christmas - Telegram Mini App Bot
Powered by aiogram 3.x
"""

import asyncio
import logging
import os
import sys
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
    MenuButtonWebApp
)

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
# Your VPS domain or GitHub Pages URL (e.g. "https://game.yourdomain.com/player/")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://yourdomain.com/player/")

if not TOKEN:
    print("Error: TELEGRAM_BOT_TOKEN is not set in .env")
    sys.exit(1)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

bot = Bot(token=TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def handle_start(message: types.Message):
    """Handles /start command with rich welcome card and WebApp launcher button."""
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎮 Play Nightmare Before Christmas",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ]
    )

    caption = (
        "🎃 <b>The Nightmare Before Christmas (2005)</b>\n\n"
        "Reverse-engineered Living Mobile / Disney J2ME classic adapted for modern smartphones!\n\n"
        "✨ <b>Features:</b>\n"
        "• 100% Native Web Engine (0ms load delay)\n"
        "• Restored 6-Track Living Mobile Sound Bank\n"
        "• 3D Tactile Mobile Keypad & Haptic Feedback\n"
        "• All 100 Cemetery Rooms\n\n"
        "Tap the button below to play directly inside Telegram!"
    )

    try:
        # If splash asset exists, send with photo banner
        splash_path = os.path.join(os.path.dirname(__file__), "assets", "splash.png")
        if os.path.exists(splash_path):
            photo = types.FSInputFile(splash_path)
            await message.answer_photo(photo=photo, caption=caption, parse_mode="HTML", reply_markup=kb)
            return
    except Exception as e:
        logging.warning(f"Could not send photo: {e}")

    await message.answer(caption, parse_mode="HTML", reply_markup=kb)


@dp.message(Command("play"))
async def handle_play(message: types.Message):
    """Direct /play command"""
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎮 Launch Game",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ]
    )
    await message.answer("Click below to launch:", reply_markup=kb)


async def main():
    # Configure bot persistent menu button next to the keyboard
    try:
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(
                text="🎮 Play Game",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        )
        logging.info("Telegram persistent Menu Button configured successfully.")
    except Exception as e:
        logging.warning(f"Failed to set menu button: {e}")

    logging.info(f"Bot starting... Serving WebApp: {WEBAPP_URL}")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())


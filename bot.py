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
# Your VPS domain or GitHub Pages URL (e.g. "https://193.36.236.221.sslip.io/player/")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://193.36.236.221.sslip.io/player/")

if not TOKEN:
    print("Error: TELEGRAM_BOT_TOKEN is not set in .env")
    sys.exit(1)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

bot = Bot(token=TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def handle_start(message: types.Message):
    """Handles /start command with rich welcome card and WebApp launcher button."""
    base_url = WEBAPP_URL.rstrip('/')
    player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎮 Play The Nightmare Before Christmas",
                    web_app=WebAppInfo(url=f"{player_base}/?v=20261022_b15")
                )
            ]
        ]
    )

    caption = (
        "🎃 <b>The Nightmare Before Christmas</b>\n\n"
        "Authentic 2005 Living Mobile J2ME classic running on a 100% native ES6 browser engine with tactile 3D retro phone keypad, true sound synthesis, and original pixel art.\n\n"
        "Tap the button below to launch instantly!"
    )

    await message.answer(caption, parse_mode="HTML", reply_markup=kb)


@dp.message(Command("play"))
async def handle_play(message: types.Message):
    """Direct play command"""
    base_url = WEBAPP_URL.rstrip('/')
    player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎮 Play Now",
                    web_app=WebAppInfo(url=f"{player_base}/?v=20261022_b15")
                )
            ]
        ]
    )
    await message.answer("Click below to launch <b>The Nightmare Before Christmas</b>:", parse_mode="HTML", reply_markup=kb)


async def main():
    # Configure bot persistent menu button next to the keyboard
    try:
        base_url = WEBAPP_URL.rstrip('/')
        player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(
                text="🎮 Play Game",
                web_app=WebAppInfo(url=f"{player_base}/?v=20261022_b15")
            )
        )
        logging.info("Telegram persistent Menu Button configured successfully.")
    except Exception as e:
        logging.warning(f"Failed to set menu button: {e}")

    logging.info(f"Bot starting... Serving WebApp: {WEBAPP_URL}")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())


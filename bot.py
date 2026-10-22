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
    """Handles /start command with clean, simplified welcome message."""
    base_url = WEBAPP_URL.rstrip('/')
    player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎮 Play Game",
                    web_app=WebAppInfo(url=f"{player_base}/?v=20261022_b16")
                )
            ]
        ]
    )

    text = (
        "🎃 <b>The Nightmare Before Christmas</b>\n\n"
        "Tap below to play!"
    )

    await message.answer(
        text,
        parse_mode="HTML",
        reply_markup=kb,
        link_preview_options=types.LinkPreviewOptions(is_disabled=True)
    )


@dp.message(Command("play"))
async def handle_play(message: types.Message):
    """Direct play command"""
    base_url = WEBAPP_URL.rstrip('/')
    player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎮 Play Game",
                    web_app=WebAppInfo(url=f"{player_base}/?v=20261022_b16")
                )
            ]
        ]
    )
    await message.answer(
        "🎃 Tap below to play:",
        parse_mode="HTML",
        reply_markup=kb,
        link_preview_options=types.LinkPreviewOptions(is_disabled=True)
    )


async def main():
    # Configure bot persistent menu button next to the keyboard
    try:
        base_url = WEBAPP_URL.rstrip('/')
        player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"
        await bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(
                text="🎮 Play Game",
                web_app=WebAppInfo(url=f"{player_base}/?v=20261022_b16")
            )
        )
        logging.info("Telegram persistent Menu Button configured successfully.")
    except Exception as e:
        logging.warning(f"Failed to set menu button: {e}")

    logging.info(f"Bot starting... Serving WebApp: {WEBAPP_URL}")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())


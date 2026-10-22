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
    """Handles /start command with rich welcome card and WebApp launcher buttons for all demos."""
    base_url = WEBAPP_URL.rstrip('/')
    # If base_url ends in player, keep it, else ensure /player/
    if not base_url.endswith("/player"):
        player_base = f"{base_url}/player"
    else:
        player_base = base_url

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🎮 Play Demo 1 (32-Bit Gothic SotN)",
                    web_app=WebAppInfo(url=f"{player_base}/?demo=1")
                )
            ],
            [
                InlineKeyboardButton(
                    text="🎨 Play Demo 2 (Arcade Neo-Geo)",
                    web_app=WebAppInfo(url=f"{player_base}/?demo=2")
                )
            ],
            [
                InlineKeyboardButton(
                    text="✨ Play Demo 3 (Micro-Pixel Eastward)",
                    web_app=WebAppInfo(url=f"{player_base}/?demo=3")
                )
            ]
        ]
    )

    caption = (
        "🎃 <b>The Nightmare Before Christmas - High-Res Pixel Art Demos</b>\n\n"
        "Compare the 3 genuine high-resolution pixel art styles (100% hard square pixels, ZERO clay/smoothing):\n\n"
        "• <b>Demo 1: 32-Bit Dark Gothic</b> — Castlevania: SotN / Blasphemous style: sharp teeth stitches, 1px pinstripes, chiseled stone.\n"
        "• <b>Demo 2: Arcade Neo-Geo</b> — Darkstalkers / Metal Slug style: bold 1px ink outlines, high-contrast cell shading.\n"
        "• <b>Demo 3: Micro-Pixel</b> — Modern indie Eastward style: 1px micro-dithering, moonlit highlights, rich vibrant textures.\n\n"
        "<i>Tip: You can also tap the <b>[D1]</b> button inside the game to switch styles live on the fly, and <b>[L2]</b> to jump to Level 2!</i>"
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
@dp.message(Command("demo1"))
@dp.message(Command("demo2"))
@dp.message(Command("demo3"))
async def handle_demos(message: types.Message):
    """Direct demo launch commands"""
    cmd = message.text.lower() if message.text else ""
    demo_id = "1"
    if "demo2" in cmd:
        demo_id = "2"
    elif "demo3" in cmd:
        demo_id = "3"

    base_url = WEBAPP_URL.rstrip('/')
    player_base = base_url if base_url.endswith("/player") else f"{base_url}/player"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=f"🎮 Launch Demo {demo_id}",
                    web_app=WebAppInfo(url=f"{player_base}/?demo={demo_id}")
                )
            ],
            [
                InlineKeyboardButton(
                    text="🔄 Compare All Demos",
                    web_app=WebAppInfo(url=f"{player_base}/?demo=1")
                )
            ]
        ]
    )
    await message.answer(f"Click below to launch <b>Demo {demo_id}</b>:", parse_mode="HTML", reply_markup=kb)


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


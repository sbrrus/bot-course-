const token ='5988768541:AAFxLUyuoZjlP8G0EfOyq_X_HbpPAedqKeo';

const {gameOptions, againOptions} = require('./option.js')

const TelegramApi = require('node-telegram-bot-api');
const option = require('./option');

const bot = new TelegramApi(token,{polling:true});

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должан ее угадать `)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадай', gameOptions)

}

const start = () => {

    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветсвие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},   
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот автора ImpreSs')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут  ${msg.from.first_name} ${msg.from.last_name ?? ''}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз')
    })

    bot.on ('callback_query',  async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id
        if (data=== '/again') {
            return startGame(chatId);
        }
        if (data === chats.chatId) {
            return bot.sendMessage(chatId, ` Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
        }else{
            return bot.sendMessage(chatId, ` К сожалению ты не угадал  цифру бот загадал ${chats[chatId]}`, againOptions)
        }
    })
}

start()
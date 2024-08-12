const fs = require('fs');

const filePath = './accounts.json';

let rawData = fs.readFileSync(filePath);
let accounts = JSON.parse(rawData);

if (Object.keys(accounts).length === 0) {
    accounts = { accounts: {} };
}

function addAccount(accountConfig) {
    for (let accountId in accounts.accounts) {
        if (accounts.accounts[accountId].details.username === accountConfig.username) {
            console.log(`Kullanıcı adı ${accountConfig.username} zaten mevcut.`);
            return;
        }
    }

    const newAccountId = Object.keys(accounts.accounts).length + 1;
    accounts.accounts[newAccountId] = {
        "details": {
            "username": accountConfig.username,
            "password": accountConfig.password
        },
        "settings": {
            "title": accountConfig.titlenotrequired ? [accountConfig.titlenotrequired] : [],
            "games": typeof accountConfig.game === 'number' ? [accountConfig.game] : [0]
        }
    };

    fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
    console.log(`Yeni hesap oluşturuldu: ${accountConfig.username}`);
}

function deleteAccount(username) {
    let accountFound = false;

    for (let accountId in accounts.accounts) {
        if (accounts.accounts[accountId].details.username === username) {
            delete accounts.accounts[accountId];
            accountFound = true;
            break;
        }
    }

    if (accountFound) {
        fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
        console.log(`Kullanıcı ${username} başarıyla silindi.`);
    } else {
        console.log(`Kullanıcı ${username} bulunamadı.`);
    }
}

module.exports = { addAccount, deleteAccount };
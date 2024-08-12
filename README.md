# steam-hourboost-bot
- Steam hourboost discord bot.

## Kurulum
- `.env` dosyasını açıp [TOKEN](https://discord.com/developers/applications),WEBHOOK_URL ve BOT_STATUS kısımlarını doldurun.
- `install-modules.bat` dosyasını çalıştırın.
- Modüller indirildikten sonra `start.bat` dosyasını açıp botunuzu başlatın.
- Komutlar gelmez ise discord'u `CTRL+R` tuşları ile yeniden başlatın.

## Kullanım
- `/hesap-ekle` komutuyla Steam kullanıcı adınızı ve şifrenizi girip bilgilerinizi veritabanına kaydedin.
- Hesabınızı ekledikten sonra hourboost sistemini başlatmak için /panel komutunu kullanıp butonlar yardımıyla başlatın.
- Steam hesabınızın guard kodunu girmek için DM'den `!guard guardkodunuz` yazarak giriniz.

## Hata Kodları
- `InvalidPassword` - Hesabın şifresi yanlış.
- `Invalid activation code` - Guard'a girilen kod geçersiz.
- `LoggedInElsewhere` - Hourboost sistemi açıkken oyuna girerseniz veya oyundayken hourboost sistemini açmaya çalışırsanız bu hatayı alırsınız.
- `RateLimitExceeded` - Bir hesaba bir çok kez giriş yapılmaya çalışıp girilemezse bu hatayı verir bir süre sonra deneyiniz.

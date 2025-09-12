import { NextPage } from 'next';
import Head from 'next/head';

const ImpressumPage: NextPage = () => {
    return (
        <>
        <Head><title>Выходные данные (Impressum) - NoiseGone</title></Head>
        <div className="container mx-auto p-8 max-w-3xl prose">
            <h1>Выходные данные (Impressum)</h1>
            <p>Информация в соответствии с § 5 TMG (Telemediengesetz).</p>
            
            <h2>Контактная информация</h2>
            <p>
                [Ваше Имя / Название Компании]<br />
                [Ваша Улица и номер дома]<br />
                [Ваш Почтовый индекс и город]<br />
                [Ваша Страна]
            </p>
            <p>
                <strong>Email:</strong> [Ваш контактный email]
            </p>
            
            <h2>Отказ от ответственности</h2>
            <p>
                Несмотря на тщательный контроль, мы не несем ответственности за содержание внешних ссылок.
                За содержание страниц, на которые ведут ссылки, несут ответственность исключительно их владельцы.
            </p>
        </div>
        </>
    );
};

export default ImpressumPage;

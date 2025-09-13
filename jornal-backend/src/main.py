import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.news import db
from src.routes.news import news_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Habilitar CORS para permitir requisições do frontend
CORS(app)

# Registrar blueprints
app.register_blueprint(news_bp, url_prefix='/api')

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Criar tabelas e dados de exemplo
with app.app_context():
    db.create_all()
    
    # Verificar se já existem notícias, se não, criar algumas de exemplo
    from src.models.news import News
    if News.query.count() == 0:
        example_news = [
            News(
                title='Nova tecnologia revoluciona o mercado financeiro',
                content='Uma nova tecnologia baseada em inteligência artificial está transformando a forma como as transações financeiras são processadas. Os bancos estão adotando sistemas automatizados que prometem maior segurança e eficiência.',
                category='Tecnologia',
                author='João Silva',
                image_url='https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
            ),
            News(
                title='Economia brasileira mostra sinais de recuperação',
                content='Os últimos indicadores econômicos apontam para uma melhora significativa no cenário nacional. O PIB cresceu 2,3% no último trimestre, superando as expectativas dos analistas.',
                category='Economia',
                author='Maria Santos',
                image_url='https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop'
            ),
            News(
                title='Campeonato nacional de futebol tem início',
                content='A nova temporada do campeonato nacional promete grandes emoções com times renovados e novos talentos. Os clubes investiram pesado em contratações para a temporada 2025.',
                category='Esportes',
                author='Pedro Costa',
                image_url='https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop'
            )
        ]
        
        for news in example_news:
            db.session.add(news)
        
        db.session.commit()
        print("Notícias de exemplo criadas!")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


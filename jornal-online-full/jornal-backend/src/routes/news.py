from flask import Blueprint, request, jsonify
from src.models.news import News, db
from datetime import datetime

news_bp = Blueprint('news', __name__)

@news_bp.route('/news', methods=['GET'])
def get_all_news():
    """Obter todas as notícias"""
    try:
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = News.query
        
        if category and category != 'all':
            query = query.filter(News.category == category)
            
        if search:
            query = query.filter(
                db.or_(
                    News.title.contains(search),
                    News.content.contains(search)
                )
            )
        
        news = query.order_by(News.created_at.desc()).all()
        return jsonify([news_item.to_dict() for news_item in news])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/news', methods=['POST'])
def create_news():
    """Criar uma nova notícia"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        required_fields = ['title', 'content', 'category', 'author']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        news_item = News.from_dict(data)
        db.session.add(news_item)
        db.session.commit()
        
        return jsonify(news_item.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@news_bp.route('/news/<int:news_id>', methods=['GET'])
def get_news(news_id):
    """Obter uma notícia específica"""
    try:
        news_item = News.query.get_or_404(news_id)
        return jsonify(news_item.to_dict())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@news_bp.route('/news/<int:news_id>', methods=['PUT'])
def update_news(news_id):
    """Atualizar uma notícia"""
    try:
        news_item = News.query.get_or_404(news_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Atualizar campos se fornecidos
        if 'title' in data:
            news_item.title = data['title']
        if 'content' in data:
            news_item.content = data['content']
        if 'category' in data:
            news_item.category = data['category']
        if 'author' in data:
            news_item.author = data['author']
        if 'imageUrl' in data:
            news_item.image_url = data['imageUrl']
        
        news_item.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(news_item.to_dict())
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@news_bp.route('/news/<int:news_id>', methods=['DELETE'])
def delete_news(news_id):
    """Deletar uma notícia"""
    try:
        news_item = News.query.get_or_404(news_id)
        db.session.delete(news_item)
        db.session.commit()
        
        return jsonify({'message': 'Notícia deletada com sucesso'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@news_bp.route('/categories', methods=['GET'])
def get_categories():
    """Obter todas as categorias disponíveis"""
    try:
        categories = db.session.query(News.category).distinct().all()
        category_list = [cat[0] for cat in categories]
        return jsonify(category_list)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


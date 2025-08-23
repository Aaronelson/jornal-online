import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.jsx'
import { Plus, Search, Calendar, User, Tag, Menu, X } from 'lucide-react'
import './App.css'

function App() {
  const [news, setNews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Formulário para nova notícia
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    imageUrl: ''
  })

  const categories = ['Política', 'Economia', 'Esportes', 'Tecnologia', 'Cultura', 'Saúde', 'Mundo']

  // Notícias de exemplo
  useEffect(() => {
    const exampleNews = [
      {
        id: 1,
        title: 'Nova tecnologia revoluciona o mercado financeiro',
        content: 'Uma nova tecnologia baseada em inteligência artificial está transformando a forma como as transações financeiras são processadas...',
        category: 'Tecnologia',
        author: 'João Silva',
        date: '2025-01-19',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
      },
      {
        id: 2,
        title: 'Economia brasileira mostra sinais de recuperação',
        content: 'Os últimos indicadores econômicos apontam para uma melhora significativa no cenário nacional...',
        category: 'Economia',
        author: 'Maria Santos',
        date: '2025-01-19',
        imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop'
      },
      {
        id: 3,
        title: 'Campeonato nacional de futebol tem início',
        content: 'A nova temporada do campeonato nacional promete grandes emoções com times renovados...',
        category: 'Esportes',
        author: 'Pedro Costa',
        date: '2025-01-18',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop'
      }
    ]
    setNews(exampleNews)
  }, [])

  const handleAddNews = () => {
    if (newNews.title && newNews.content && newNews.category && newNews.author) {
      const newsItem = {
        id: Date.now(),
        ...newNews,
        date: new Date().toISOString().split('T')[0],
        imageUrl: newNews.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'
      }
      setNews([newsItem, ...news])
      setNewNews({ title: '', content: '', category: '', author: '', imageUrl: '' })
      setIsDialogOpen(false)
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setIsMobileMenuOpen(false)
  }

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredNews = filteredNews[0]
  const otherNews = filteredNews.slice(1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-900">Jornal Online</h1>
            </div>

            {/* Navegação Desktop */}
            <nav className="hidden lg:flex space-x-6">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  selectedCategory === 'all' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Início
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                    selectedCategory === category ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>

            {/* Botões Mobile e Desktop */}
            <div className="flex items-center space-x-2">
              {/* Botão Adicionar Notícia */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm px-3 sm:px-4">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Adicionar Notícia</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] mx-4 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Adicionar Nova Notícia</DialogTitle>
                    <DialogDescription className="text-sm">
                      Preencha os campos abaixo para adicionar uma nova notícia ao site.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-sm font-medium">Título</Label>
                      <Input
                        id="title"
                        value={newNews.title}
                        onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                        placeholder="Digite o título da notícia"
                        className="text-base"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="content" className="text-sm font-medium">Conteúdo</Label>
                      <Textarea
                        id="content"
                        value={newNews.content}
                        onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                        placeholder="Digite o conteúdo da notícia"
                        rows={4}
                        className="text-base resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category" className="text-sm font-medium">Categoria</Label>
                        <Select value={newNews.category} onValueChange={(value) => setNewNews({...newNews, category: value})}>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category} className="text-base">{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="author" className="text-sm font-medium">Autor</Label>
                        <Input
                          id="author"
                          value={newNews.author}
                          onChange={(e) => setNewNews({...newNews, author: e.target.value})}
                          placeholder="Nome do autor"
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="imageUrl" className="text-sm font-medium">URL da Imagem (opcional)</Label>
                      <Input
                        id="imageUrl"
                        value={newNews.imageUrl}
                        onChange={(e) => setNewNews({...newNews, imageUrl: e.target.value})}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="text-base"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-base py-3">
                      Cancelar
                    </Button>
                    <Button onClick={handleAddNews} className="bg-red-600 hover:bg-red-700 text-base py-3">
                      Adicionar Notícia
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Menu Hambúrguer Mobile */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Categorias</SheetTitle>
                    <SheetDescription className="text-left">
                      Navegue pelas diferentes seções do jornal
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-2 py-6">
                    <button 
                      onClick={() => handleCategorySelect('all')}
                      className={`text-left text-lg font-medium transition-colors p-4 rounded-lg ${
                        selectedCategory === 'all' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      Início
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`text-left text-lg font-medium transition-colors p-4 rounded-lg ${
                          selectedCategory === category ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Barra de Pesquisa */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar notícias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 text-base py-3"
            />
          </div>
        </div>
      </div>

      {/* Navegação Mobile Horizontal */}
      <div className="lg:hidden bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex space-x-1 px-4 py-2">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 text-sm font-medium transition-colors px-4 py-2 rounded-full ${
              selectedCategory === 'all' ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100 hover:text-blue-600'
            }`}
          >
            Início
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 text-sm font-medium transition-colors px-4 py-2 rounded-full ${
                selectedCategory === category ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100 hover:text-blue-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma notícia encontrada.</p>
          </div>
        ) : (
          <>
            {/* Notícia Principal */}
            {featuredNews && (
              <div className="mb-6 sm:mb-8">
                <Card className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2">
                      <img
                        src={featuredNews.imageUrl}
                        alt={featuredNews.title}
                        className="w-full h-48 sm:h-64 lg:h-full object-cover"
                      />
                    </div>
                    <div className="lg:w-1/2 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <Badge variant="secondary" className="bg-red-100 text-red-800 text-sm w-fit">
                          {featuredNews.category}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(featuredNews.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                        {featuredNews.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                        {featuredNews.content}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {featuredNews.author}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Grid de Outras Notícias */}
            {otherNews.length > 0 && (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {otherNews.map(item => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs w-fit">
                          {item.category}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <CardTitle className="text-base sm:text-lg line-clamp-2 leading-tight">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription className="line-clamp-3 mb-3 text-sm">
                        {item.content}
                      </CardDescription>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {item.author}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Jornal Online</h3>
            <p className="text-gray-400 text-sm sm:text-base">Notícias em tempo real para você</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-4">
              © 2025 Jornal Online. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App


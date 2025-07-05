import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      id: string;
      name: string;
      size: string;
      type: "image" | "video";
      isPrivate: boolean;
      url: string;
    }>
  >([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    simulateUpload(files);
  };

  const simulateUpload = (files: File[]) => {
    files.forEach((file, index) => {
      const newFile = {
        id: Date.now() + index + "",
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: file.type.startsWith("image/")
          ? ("image" as const)
          : ("video" as const),
        isPrivate: false,
        url: URL.createObjectURL(file),
      };

      setTimeout(
        () => {
          setUploadedFiles((prev) => [...prev, newFile]);
        },
        1000 + index * 500,
      );
    });
  };

  const togglePrivacy = (id: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, isPrivate: !file.isPrivate } : file,
      ),
    );
  };

  const generateLink = (file: any) => {
    const baseUrl = "https://fotoline.ru";
    const linkType = file.isPrivate ? "private" : "public";
    return `${baseUrl}/${linkType}/${file.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-light via-sky-light to-plum-light">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-coral to-sky rounded-lg flex items-center justify-center">
                <Icon name="Camera" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-coral to-sky bg-clip-text text-transparent">
                Фотолайн
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-plum/20 text-plum-dark">
                <Icon name="Shield" size={14} className="mr-1" />
                Приватность
              </Badge>
              <Badge variant="secondary" className="bg-sky/20 text-sky-dark">
                <Icon name="Link" size={14} className="mr-1" />
                Быстрые ссылки
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-white">
            Загружайте и делитесь
            <br />
            <span className="bg-gradient-to-r from-coral to-sky bg-clip-text text-transparent">
              своими воспоминаниями
            </span>
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Современный сервис для загрузки фото и видео с возможностью создания
            публичных и приватных ссылок
          </p>

          {/* Upload Zone */}
          <div
            className={`relative max-w-2xl mx-auto p-12 border-2 border-dashed rounded-2xl transition-all duration-300 ${
              isDragging
                ? "border-coral bg-coral/10 scale-105"
                : "border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-coral to-sky rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Upload" size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Перетащите файлы сюда
              </h3>
              <p className="text-white/70 mb-6">
                Или нажмите для выбора файлов
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-coral to-sky text-white border-0 hover:scale-105 transition-transform"
              >
                <Icon name="FolderOpen" size={20} className="mr-2" />
                Выбрать файлы
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Files Section */}
      {uploadedFiles.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Ваши файлы
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedFiles.map((file) => (
                <Card
                  key={file.id}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-800 truncate">
                        {file.name}
                      </CardTitle>
                      <Badge
                        variant={file.isPrivate ? "destructive" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => togglePrivacy(file.id)}
                      >
                        <Icon
                          name={file.isPrivate ? "Lock" : "Globe"}
                          size={14}
                          className="mr-1"
                        />
                        {file.isPrivate ? "Приватный" : "Публичный"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Icon
                          name={file.type === "image" ? "Image" : "Video"}
                          size={16}
                        />
                        <span>{file.size}</span>
                      </div>

                      <div className="bg-gray-100 p-2 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Ссылка для доступа:
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigator.clipboard.writeText(generateLink(file))
                            }
                          >
                            <Icon name="Copy" size={16} />
                          </Button>
                        </div>
                        <code className="text-xs text-gray-600 break-all">
                          {generateLink(file)}
                        </code>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-sky/10 border-sky/30"
                        >
                          <Icon name="Download" size={16} className="mr-2" />
                          Скачать
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-plum/10 border-plum/30"
                        >
                          <Icon name="Share" size={16} className="mr-2" />
                          Поделиться
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Возможности сервиса
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-coral rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Shield" size={24} className="text-white" />
                </div>
                <CardTitle className="text-xl">Приватность</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Контролируйте доступ к своим файлам с помощью публичных и
                  приватных ссылок
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-sky rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} className="text-white" />
                </div>
                <CardTitle className="text-xl">Быстрая загрузка</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Drag-and-drop интерфейс для мгновенной загрузки фото и видео
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-plum rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Link" size={24} className="text-white" />
                </div>
                <CardTitle className="text-xl">Умные ссылки</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Автоматическое создание ссылок для легкого обмена файлами
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

const fs = require('fs');
const path = require('path');

// Funkcja do przeszukiwania plików w folderze
function updateFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateFiles(fullPath); // Rekursywne przechodzenie do podkatalogów
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      updateFile(fullPath); // Aktualizuj tylko pliki .js i .jsx
    }
  });
}

// Funkcja do aktualizacji zawartości pliku
function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Zamiana Routes na Routes (React Router 6)
  content = content.replace(/Routes/g, 'Routes');

  // Zamiana 'element={<ComponentName />}' na 'element={<ComponentName />}'
  content = content.replace(/element={<(.*?) />}/g, 'element={<$1 />}');

  // Zamiana 'Redirect' na 'Navigate'
  content = content.replace(/<Navigate(.*?)to=/g, '<Navigate$1to=');
  content = content.replace(/<Navigate(.*?)from=/g, '<Navigate$1from=');

  // Zmiana importów dla `useHistory` na `useNavigate`
  content = content.replace(/import { useNavigate } from 'react-router-dom';/g, "import { useNavigate } from 'react-router-dom';");
  
  // Zmiana użycia useHistory na useNavigate
  content = content.replace(/history\.push\((.*?)\)/g, 'navigate($1)');
  content = content.replace(/history\.replace\((.*?)\)/g, 'navigate($1)');

  // Zmiana na użycie <Route element={<Component />} />
  content = content.replace(/<Route path="(.*?)" element={<(.*?) />}/g, '<Route path="$1" element={<$2 />} />');
  
  // Zmiana <Routes> na <Routes>
  content = content.replace(/<Routes>/g, '<Routes>');
  content = content.replace(/<\/Switch>/g, '</Routes>');
  
  // Zapisz zaktualizowany plik
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${filePath}`);
}

// Uruchomienie skryptu w katalogu głównym aplikacji
const directory = __dirname; // Zmieniamy na bieżący katalog (katalog główny aplikacji)
updateFiles(directory);

import json
app = open(r'src/App.jsx','r',encoding='utf-8').read()
if 'MagzaReplica' not in app:
    app = app.replace("import MarketPlaceReplica from './pages/MarketPlaceReplica';\n", "import MarketPlaceReplica from './pages/MarketPlaceReplica';\nimport MagzaReplica from './pages/MagzaReplica';\n")
    app = app.replace("<Route path=\"/marketplace-replica\" element={<MarketPlaceReplica />} />\n", "<Route path=\"/marketplace-replica\" element={<MarketPlaceReplica />} />\n          <Route path=\"/magza-replica\" element={<MagzaReplica />} />\n")
    open(r'src/App.jsx','w',encoding='utf-8').write(app)
    print('updated App routes')
else:
    print('App already updated')

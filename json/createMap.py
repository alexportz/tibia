import json

# Carrega o mapa base
with open("mapa.json", "r", encoding="utf-8") as f:
    mapa_data = json.load(f)

# Define os sprites usados
SPRITES = {
    "agua": (4, 1),
    "grama": (1, 1),
}

# Mapeia posições do mapa
position_map = {}
for sqm in mapa_data["sqms"]:
    position_map[(sqm["sqmCol"], sqm["sqmLin"])] = sqm

# Define ilhas maiores
max_col = max(c for c, _ in position_map)
max_lin = max(l for _, l in position_map)
island_centers = [
    (max_col // 4, max_lin // 4),
    (max_col // 2, max_lin // 2),
    (3 * max_col // 4, 3 * max_lin // 4)
]

# Inicializa todos como água
for sqm in mapa_data["sqms"]:
    sqm["renderCol"], sqm["renderLin"] = SPRITES["agua"]
    sqm["propriedades"]["podemover"] = False

# Gera as ilhas
ISLAND_RADIUS = 7
land_positions = set()
for center_col, center_lin in island_centers:
    for dx in range(-ISLAND_RADIUS, ISLAND_RADIUS + 1):
        for dy in range(-ISLAND_RADIUS, ISLAND_RADIUS + 1):
            c, l = center_col + dx, center_lin + dy
            if (c, l) in position_map:
                land_positions.add((c, l))

# Conecta as ilhas
for i in range(len(island_centers) - 1):
    (x1, y1), (x2, y2) = island_centers[i], island_centers[i + 1]
    for c in range(min(x1, x2), max(x1, x2) + 1):
        if (c, y1) in position_map:
            land_positions.add((c, y1))
    for l in range(min(y1, y2), max(y1, y2) + 1):
        if (x2, l) in position_map:
            land_positions.add((x2, l))





# Aplica grama NORTE SUL LESTE OESTE
for c, l in land_positions:
    sqm = position_map[(c, l)]
    sqm["renderCol"], sqm["renderLin"] = SPRITES["grama"]
    sqm["propriedades"]["podemover"] = True

# Adiciona bordas apenas na direção onde houver água
BORDAS_DIRECIONAIS = {
    (-1, 0): (4, 2),  # norte (topo)
    (0, 1):  (2, 1),  # leste (direita)
    (0, -1): (5, 1),  # oeste (esquerda)
    (1, 0):  (1, 2),  # sul (baixo)
}

for c, l in land_positions:
    for dx, dy in BORDAS_DIRECIONAIS:
        nc, nl = c + dx, l + dy
        if (nc, nl) in position_map and (nc, nl) not in land_positions:
            vizinho = position_map[(nc, nl)]
            if (vizinho["renderCol"], vizinho["renderLin"]) == SPRITES["agua"]:
                vizinho["renderCol"], vizinho["renderLin"] = BORDAS_DIRECIONAIS[(dx, dy)]
                vizinho["propriedades"]["podemover"] = False

# Aplica grama nas DIAGONAIS
for c, l in land_positions:
    sqm = position_map[(c, l)]
    sqm["renderCol"], sqm["renderLin"] = SPRITES["grama"]
    sqm["propriedades"]["podemover"] = True

# Adiciona bordas APENAS se o vizinho for água
BORDAS = {
    (-1, -1): (0, 0), #diagonal topo esquerda
    (1, 1): (2, 2), #diagonal baixo direita
    (-1, 1): (2, 0), #diagonal baixo esquerda
    (1, -1): (0, 2), #diagonal topo direita
}
for c, l in land_positions:
    for dx, dy in BORDAS:
        nc, nl = c + dx, l + dy
        if (nc, nl) in position_map and (nc, nl) not in land_positions:
            neighbor = position_map[(nc, nl)]
            # Garante que a posição ainda é água
            if (neighbor["renderCol"], neighbor["renderLin"]) == SPRITES["agua"]:
                neighbor["renderCol"], neighbor["renderLin"] = BORDAS[(dx, dy)]
                neighbor["propriedades"]["podemover"] = False

# Salva o mapa
with open("mapa_gerado.json", "w", encoding="utf-8") as f:
    json.dump(mapa_data, f, ensure_ascii=False, indent=4)

print("Mapa gerado com sucesso: mapa_gerado.json")

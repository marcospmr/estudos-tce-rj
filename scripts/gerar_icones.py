#!/usr/bin/env python3
"""Gera os ícones PNG do app sem dependências (zlib + struct).

Desenho: fundo azul-marinho com um escudo branco e um "check" azul (segurança + acerto).
"""
import math
import struct
import zlib
from pathlib import Path

DEST = Path(__file__).resolve().parent.parent / "app" / "icons"
AZUL = (30, 58, 138)
BRANCO = (255, 255, 255)


def png(caminho, w, hgt, pixels):
    raw = b"".join(b"\x00" + bytes(pixels[y * w * 3:(y + 1) * w * 3]) for y in range(hgt))

    def chunk(tipo, dados):
        c = struct.pack(">I", len(dados)) + tipo + dados
        return c + struct.pack(">I", zlib.crc32(tipo + dados) & 0xFFFFFFFF)

    dados = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, hgt, 8, 2, 0, 0, 0))
    dados += chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    caminho.write_bytes(dados)


def dentro_escudo(x, y):
    # Coordenadas normalizadas (-1..1). Escudo: topo reto com cantos, laterais que convergem para a ponta.
    if y < -0.62 or y > 0.78:
        return False
    if y <= 0.05:
        return abs(x) <= 0.58
    # da metade para baixo, curva até a ponta em y = 0.78
    t = (y - 0.05) / (0.78 - 0.05)
    return abs(x) <= 0.58 * math.sqrt(max(0.0, 1 - t * t))


def dist_segmento(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def no_check(x, y):
    e = 0.075
    return dist_segmento(x, y, -0.28, 0.02, -0.07, 0.24) < e or dist_segmento(x, y, -0.07, 0.24, 0.32, -0.22) < e


def desenhar(tam, escala=1.0, ss=3):
    px = []
    for j in range(tam):
        for i in range(tam):
            acc = [0, 0, 0]
            for sj in range(ss):
                for si in range(ss):
                    x = ((i + (si + 0.5) / ss) / tam * 2 - 1) / escala
                    y = ((j + (sj + 0.5) / ss) / tam * 2 - 1) / escala
                    cor = AZUL
                    if dentro_escudo(x, y):
                        cor = AZUL if no_check(x, y) else BRANCO
                    for k in range(3):
                        acc[k] += cor[k]
            px.extend(round(a / (ss * ss)) for a in acc)
    return px


DEST.mkdir(parents=True, exist_ok=True)
for nome, tam, esc in [("icon-192.png", 192, 1.0), ("icon-512.png", 512, 1.0), ("apple-touch-icon.png", 180, 1.0), ("icon-maskable-512.png", 512, 0.72)]:
    png(DEST / nome, tam, tam, desenhar(tam, esc, 2 if tam > 200 else 3))
    print("gerado", nome)

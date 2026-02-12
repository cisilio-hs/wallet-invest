<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\AssetType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    public function run(): void
    {
        $acao = AssetType::where('slug', 'acao')->first()->id;
        $fii  = AssetType::where('slug', 'fii')->first()->id;
        $etf  = AssetType::where('slug', 'etf')->first()->id;
        $cripto = AssetType::where('slug', 'cripto')->first()->id;
        $commodity = AssetType::where('slug', 'commodity')->first()->id;

        $assets = [

            // Ações Brasil
            ['ticker' => 'ABEV3', 'name' => 'Ambev', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'B3SA3', 'name' => 'B3', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'BBAS3', 'name' => 'Banco do Brasil', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'BBSE3', 'name' => 'BB Seguridade', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'EGIE3', 'name' => 'Engie Brasil', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'FLRY3', 'name' => 'Fleury', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'ITSA4', 'name' => 'Itaúsa', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'KLBN11', 'name' => 'Klabin', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'MDIA3', 'name' => 'M. Dias Branco', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'SAPR11', 'name' => 'Sanepar', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'SUZB3', 'name' => 'Suzano', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'TAEE11', 'name' => 'Taesa', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'VIVA3', 'name' => 'Vivara', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'VIVT3', 'name' => 'Telefônica Brasil', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'WEGE3', 'name' => 'Weg', 'asset_type_id' => $acao, 'market' => 'BR', 'currency' => 'BRL'],

            // FIIs
            ['ticker' => 'BTHF11', 'name' => 'BTG Fundo de Fundos', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'BTLG11', 'name' => 'BTG Logística', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'HGBS11', 'name' => 'Hedge Brasil Shopping', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'HGCR11', 'name' => 'CSHG Recebíveis', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'HGLG11', 'name' => 'CSHG Logística', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'IRIM11', 'name' => 'Iridium Recebíveis', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'MXRF11', 'name' => 'Maxi Renda', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'VGIR11', 'name' => 'Valora Recebíveis', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'VILG11', 'name' => 'Vinci Logística', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'VISC11', 'name' => 'Vinci Shopping', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'XPLG11', 'name' => 'XP Logística', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],
            ['ticker' => 'XPML11', 'name' => 'XP Malls', 'asset_type_id' => $fii, 'market' => 'BR', 'currency' => 'BRL'],

            // ETFs e ativos internacionais
            ['ticker' => 'IAU', 'name' => 'iShares Gold Trust', 'asset_type_id' => $commodity, 'market' => 'US', 'currency' => 'USD'],
            ['ticker' => 'IBIT', 'name' => 'Bitcoin ETF', 'asset_type_id' => $cripto, 'market' => 'US', 'currency' => 'USD'],
            ['ticker' => 'QQQ', 'name' => 'Invesco QQQ', 'asset_type_id' => $etf, 'market' => 'US', 'currency' => 'USD'],
            ['ticker' => 'DHS', 'name' => 'WisdomTree High Dividend', 'asset_type_id' => $etf, 'market' => 'US', 'currency' => 'USD'],
            ['ticker' => 'IVV', 'name' => 'iShares S&P 500', 'asset_type_id' => $etf, 'market' => 'US', 'currency' => 'USD'],
            ['ticker' => 'NOBL', 'name' => 'S&P 500 Dividend Aristocrats', 'asset_type_id' => $etf, 'market' => 'US', 'currency' => 'USD'],
            ['ticker' => 'SCHD', 'name' => 'Schwab US Dividend Equity', 'asset_type_id' => $etf, 'market' => 'US', 'currency' => 'USD'],
            ['ticker' => 'SCHH', 'name' => 'Schwab US REIT ETF', 'asset_type_id' => $etf, 'market' => 'US', 'currency' => 'USD'],
            ['ticker' => 'VNQ', 'name' => 'Vanguard Real Estate ETF', 'asset_type_id' => $etf, 'market' => 'US', 'currency' => 'USD'],
            ['ticker' => 'VNQI', 'name' => 'Vanguard Global ex-US Real Estate', 'asset_type_id' => $etf, 'market' => 'US', 'currency' => 'USD'],
        ];

        foreach ($assets as $asset) {
            Asset::create($asset);
        }
    }
}

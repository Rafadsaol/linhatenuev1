import {defineConfig} from 'vite';
import {campaignSyncPlugin} from './scripts/campaign-server.js';
export default defineConfig({plugins:[campaignSyncPlugin()],server:{port:3000,strictPort:true,watch:{ignored:['**/.linha-tenue/**']}},preview:{strictPort:true}});

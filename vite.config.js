import {defineConfig} from 'vite';
import {campaignSyncPlugin} from './scripts/campaign-server.js';
export default defineConfig({plugins:[campaignSyncPlugin()],server:{watch:{ignored:['**/.linha-tenue/**']}}});

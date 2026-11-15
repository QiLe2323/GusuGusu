// Interpretive miniatures informed by each archival subject, not measured reconstructions.
export const gusuDioramaScenes = {
  liaojia: { name: '廖家巷', title: '一线巷光', layout: 'lane', camera: .12 },
  beisi: { name: '北寺塔', title: '塔影入云', layout: 'pagoda', camera: -.26, framing: 1.12 },
  guanqian: { name: '观前街', title: '长街开市', layout: 'market', camera: -.22 },
  lujia: { name: '菉葭巷', title: '巷底旧桥', layout: 'woodbridge', water: true, willow: true },
  miluo: { name: '弥罗宝阁', title: '宝阁重现', layout: 'pavilion', framing: 1.06 },
  pingjiang: { name: '平江路', title: '水巷缓行', layout: 'pingjiang', water: true, willow: true, boat: true },
  xuanmiao: { name: '玄妙观正山门', title: '翘檐灯影', layout: 'temple' },
  xuanqiao: { name: '悬桥巷', title: '悬桥巷深', layout: 'lane', camera: -.30 },
  anchashi: { name: '按察使署照壁', title: '照壁月门', layout: 'screenwall', camera: -.15 },
  twinpagodas: { name: '双塔 · 定慧寺巷', title: '双塔破雾', layout: 'twintowers', camera: -.19, framing: 1.09 },
  wuwang: { name: '双塔吴王桥', title: '桥下回波', layout: 'stonebridge', water: true },
  boxi: { name: '博习医院', title: '砖窗透光', layout: 'hospital', camera: -.28 },
  shiquan: { name: '十全街', title: '树荫穿街', layout: 'treestreet', camera: -.20 },
  wuyachang: { name: '十全街河 · 吴衙场', title: '两岸照水', layout: 'waterlane', water: true, river: 'long' },
  brickbridge: { name: '十全河 · 百步桥', title: '百步听潮', layout: 'canalbend', water: true, willow: true, river: 'long' },
  wuxianlibrary: { name: '吴县图书馆 · 大公园', title: '书阁印痕', layout: 'library', camera: -.23 },
  xingzao: { name: '星造桥', title: '石阶近水', layout: 'waterside', water: true, river: 'long' },
  panmen: { name: '盘门城楼', title: '城楼起雾', layout: 'citygate', framing: 1.07 },
  jinmen: { name: '金门', title: '金门旌影', layout: 'crenelgate', camera: -.22 },
  xumen: { name: '胥门', title: '城门回声', layout: 'barbican', camera: -.30 }
};

const sceneStories = {
  liaojia: ['光穿巷口', '让光走进巷子', '一束暖光从巷口走到白墙，窄巷的深处渐渐显露。', 'slide'],
  beisi: ['九层塔影', '点亮塔尖', '塔檐自下而上叠起，金色的光沿塔身向塔尖流动。', 'stack'],
  guanqian: ['开市的一刻', '展开街边棚布', '店铺分列长街两侧，棚布依次展开，市街从安静转向热闹。', 'street'],
  lujia: ['桥与水的记忆', '找回旧时水道', '木桥一块块铺向对岸，在巷道与旧水道之间切换。', 'plank'],
  miluo: ['消失的轮廓', '显露楼阁旧影', '先出现楼阁的金色轮廓，再看三层屋檐一层层重现。', 'outline'],
  pingjiang: ['一船慢时光', '让小船稍作停留', '小船划过屋影和柳影，停下时可以细看河面的倒影。', 'rise'],
  xuanmiao: ['山门灯火', '点亮山门灯笼', '从山门外看翘檐，灯笼依次亮起，暖光落在门前。', 'fold'],
  xuanqiao: ['墙间的纵深', '沿墙寻找远处', '两面长墙向深处展开，一条细线沿墙脚引向巷尾。', 'depth'],
  anchashi: ['月门框景', '透过月门看一眼', '圆门像一扇取景窗，透过白墙看见门后的一枝竹影。', 'frame'],
  twinpagodas: ['两塔相望', '让光在双塔间流动', '两座塔交替逐层显现，一线光在塔尖之间画出天际线。', 'pair'],
  wuwang: ['桥洞的回响', '激起桥下一圈水波', '桥身从两岸合拢，水波从桥洞向外层层扩散。', 'arch'],
  boxi: ['窗里的暖光', '依次点亮窗列', '建筑以砖墙和长窗列展开，暖光沿窗格一扇扇走过。', 'windows'],
  shiquan: ['树影落长街', '让树荫轻轻摇动', '树冠从街道两侧伸出，斑驳的影子沿着路面移动。', 'canopy'],
  wuyachang: ['隔河的人家', '挂起河岸的布帘', '窄河穿过两岸人家，布帘轻摆，倒影在水中交错。', 'banks'],
  brickbridge: ['桥上向东看', '沿水望向远处', '低桥横跨狭长河道，流动的亮纹把视线引向河深处。', 'current'],
  wuxianlibrary: ['翻开的城市记忆', '翻开一页旧时光', '旧馆前展开一本小书，纸页转动，馆舍轮廓映在页间。', 'pages'],
  xingzao: ['走近水的台阶', '沿石阶走到水边', '近处的屋檐和低处的石阶围着窄河展开，水边出现细小涟漪。', 'steps'],
  panmen: ['门里门外', '推开盘门', '城墙先立起，城楼随后展开，两扇木门向内缓缓开启。', 'gate'],
  jinmen: ['城门开市', '扬起街口的旗幡', '街角、垛口与门洞构成一片市街，旗幡在门前依次展开。', 'banners'],
  xumen: ['石拱里的光', '把光引入门洞', '厚石墙围出深门洞，一条光带从暗处慢慢走到门外。', 'tunnel']
};
for (const [id, [chapter, action, description, entry]] of Object.entries(sceneStories)) {
  Object.assign(gusuDioramaScenes[id], { chapter, action, description, entry });
}

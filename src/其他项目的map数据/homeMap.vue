<!--首页地图-->
<template>
  <div class="risk-level-list">
    <!-- 风险等级选择 -->
    <div class="risk-query-list">
        <div class="risk-level risk-active" @click="riskLevel($event,'')">
            <span style="display: inline-block;width:10px;height:10px;color:#4AF784;background:#4AF784;"></span>
            <span style="color:#b8cefd;font-size: 15px;">全部</span>
        </div>
        
        <!-- <div class="risk-line"></div> -->
        <div class="risk-level" @click="riskLevel($event,'1006004')">
            <span style="display: inline-block;width:10px;height:10px;color:#FF0000;background:#FF0000;"></span>
            <span style="color:#b8cefd;font-size: 15px;">四级</span>
        </div>
        
        <!-- <div class="risk-line"></div> -->
        <div class="risk-level" @click="riskLevel($event,'1006003')">
            <span style="display: inline-block;width:10px;height:10px;color:#FF9900;background:#FF9900;"></span>
            <span style="color:#b8cefd;font-size: 15px;">三级</span>
        </div>
        
        <!-- <div class="risk-line"></div> -->
        <div class="risk-level" @click="riskLevel($event,'1006002')">
            <span style="display: inline-block;width:10px;height:10px;color:#FFFF00;background:#FFFF00;"></span>
            <span style="color:#b8cefd;font-size: 15px;">二级</span>
        </div>
        
        <div class="risk-level" @click="riskLevel($event,'1006001')">
            <span style="display: inline-block;width:10px;height:10px;color:#59cf92;background:#59cf92;"></span>
            <span style="color:#b8cefd;font-size: 15px;">一级</span>
        </div>
    </div>
    <!-- 风险legend -->
    <div class="risk-legend">
        <!-- <div class="risk-legend-item">
            <div class="point-div" style="background-color: #d1dad4;"></div> 
            <span>未开工</span>
        </div> -->
        <div class="risk-legend-item">
            <div class="point-div" style="background-color: #fec400;"></div>
            <span>已开工</span>
            <span id="riskZxz" class="risk-num"></span>
        </div>
        <div class="risk-legend-item">
            <div class="point-div" style="background-color: #4cf580;"></div>
            <span>已完成</span>
            <span id="riskYwc" class="risk-num"></span>
        </div>
    </div>
    <!-- 监控中心的按钮 -->
    <!-- <label id="surveillanceCenter-entrance" data-bind="click:surveillanceCenterClick"></label> -->
    <!-- 返回省地图用 -->
    <div class="back-gansu-map" v-on:click="backProvinceMap"></div>
    <label id="currentProvince">甘肃省</label>
    <!-- 省检修等电站列表 -->
    <div class="sjxdz-list" id="sjxdzList">
    </div>
    <!-- 省地图 -->
    <div class="gan-su-map" id="gsEchartMap"></div>
    <!-- 地市地图 -->
    <div class="gan-su-city-map" id="gsCityEchartMap"></div>
  </div>
</template>


<script>
import {getGsEchartsMap,getCityByProv,getAreaByCity,getAreaList} from "@/api/home/home.js"
import dictionaryUnits from '@/utils/dictionaryUnits.js'
import echarts from "echarts";
import china from "@/static/map/china.json"
import axios from "axios";

import levelAllSymbolUrl from "@assets/images/home/map_mark.png";
import level1lSymbolUrl from "@assets/images/home/map_mark1.png";
import level2SymbolUrl from "@assets/images/home/map_mark2.png";
import level3SymbolUrl from "@assets/images/home/map_mark3.png";
import level4SymbolUrl from "@assets/images/home/map_mark4.png";

import _ywc from '@assets/images/home/ywc-icon.png';
import _zxz from '@assets/images/home/zxz-icon.png';

const RMCP_WORK_STATE = "1007"; // 计划状态
const RMCP_WORK_TYPE = "1072"; // 专业类型
const RMCP_WORK_RISK_LEVEL = "1006"; // 风险等级

/** 当前网省
 * 北京市
 * 天津市
 * 河北省
 * 冀北
 * 蒙东
 * 山西省
 * 山东省
 * 上海市
 * 江苏省
 * 浙江省
 * 安徽省
 * 福建省
 * 湖北省
 * 湖南省
 * 河南省
 * 江西省
 * 四川省
 * 重庆市
 * 辽宁省
 * 吉林省
 * 黑龙江省
 * 内蒙古自治区
 * 陕西省
 * 甘肃省
 * 青海省
 * 宁夏回族自治区
 * 新疆维吾尔族自治区
 * 西藏自治区
 */
let CURRENT_PROVINCE = "甘肃省";
let mapProvince = "gansu";

export default {
  name: "homeMap",
  components: {},
  data() {
    return {
        riskLevels: "",
        cityNames: ["北京市", "重庆市", "翼北公司", "上海市", "天津市"],//用来保存直辖区
        colorArr: ["", "#59cf92", "#FFFF00", "#FF9900", "#FF0000"], //地图发光体颜色
        clickCityName: "", //地图圈点击事件防止重复点击
        mousemoveCityName: "", //地图全店的悬浮防止来回获取数据
        mousemoveText: "", //地图圈点的提示信息
        option: "",
        isCityFlg: "", //0：单位，1：地市
        levelSymbolUrl:levelAllSymbolUrl,
        gsGeoCoordMap: {
            "兰州市": [103.823557, 36.058039],
            "白银市": [104.273606, 36.95568],
            "定西市": [104.626294, 35.179578],
            "甘南藏族自治州": [102.911008, 34.586354],
            "金昌市": [102.187888, 38.514238],
            "酒泉市": [96.110795, 39.944023],
            "临夏回族自治州": [103.212006, 35.599446],
            "陇南市": [104.929379, 33.388598],
            "平凉市": [106.684691, 35.54279],
            "庆阳市": [107.638372, 35.734218],
            "天水市": [105.724998, 34.578529],
            "武威市": [102.634697, 37.929996],
            "张掖市": [100.455472, 38.932897],
            "嘉峪关市": [98.277304, 39.786529]
            },
        //各网省地图信息
        provinceMapInfo: {
          "安徽省": {
              "mapProvince": "anhui",
              "gsGeoCoordMap": {
                  "安庆市": [117.043551, 30.50883],
                  "蚌埠市": [117.363228, 32.939667],
                  "亳州市": [115.782939, 33.869338],
                  "池州市": [117.489157, 30.656037],
                  "滁州市": [118.316264, 32.303627],
                  "阜阳市": [115.819729, 32.896969],
                  "合肥市": [117.283042, 31.86119],
                  "淮北市": [116.794664, 33.971707],
                  "淮南市": [117.018329, 32.647574],
                  "黄山市": [118.317325, 29.709239],
                  "六安市": [116.507676, 31.752889],
                  "马鞍山市": [118.507906, 31.689362],
                  "铜陵市": [117.816576, 30.929935],
                  "芜湖市": [118.376451, 31.326319],
                  "宿州市": [116.984084, 33.633891],
                  "宣城市": [118.757995, 30.945667]
              }
          },
          "北京市": {
              "mapProvince": "beijing",
              "gsGeoCoordMap": {
                  "东城区": [116.418757, 39.917544],
                  "西城区": [116.366794, 39.915309],
                  "朝阳区": [116.486409, 39.921489],
                  "丰台区": [116.286968, 39.863642],
                  "石景山区": [116.195445, 39.914601],
                  "海淀区": [116.310316, 39.956074],
                  "门头沟区": [116.105381, 39.937183],
                  "房山区": [116.139157, 39.735535],
                  "通州区": [116.658603, 39.902486],
                  "顺义区": [116.653525, 40.128936],
                  "昌平区": [116.235906, 40.218085],
                  "大兴区": [116.338033, 39.728908],
                  "怀柔区": [116.637122, 40.324272],
                  "平谷区": [117.112335, 40.144783],
                  "密云区": [116.843352, 40.377362],
                  "延庆区": [115.985006, 40.465325]
              }
          },
          "重庆市": {
              "mapProvince": "chongqing",
              "gsGeoCoordMap": {
                  "铜梁区": [106.054948, 29.839944],
                  "长寿区": [107.074854, 29.833671],
                  "潼南区": [105.841818, 30.189554],
                  "合川区": [106.265554, 29.990993],
                  "璧山区": [106.231126, 29.593581],
                  "九龙坡区": [106.480989, 29.523492],
                  "武隆区": [107.75655, 29.32376],
                  "渝中区": [106.56288, 29.556742],
                  "永川区": [105.894714, 29.348748],
                  "南川区": [107.098153, 29.156646],
                  "大渡口区": [106.48613, 29.481002],
                  "荣昌区": [105.594061, 29.403627],
                  "大足区": [105.715319, 29.700498],
                  "开州区": [108.413317, 31.167735],
                  "梁平区": [107.800034, 30.672168],
                  "綦江区": [106.651417, 29.028091],
                  "涪陵区": [107.394905, 29.703652],
                  "万州区": [108.380246, 30.807807],
                  "黔江区": [108.782577, 29.527548],
                  "巴南区": [106.519423, 29.381919],
                  "江津区": [106.253156, 29.283387],
                  "沙坪坝区": [106.4542, 29.541224],
                  "南岸区": [106.560813, 29.523992],
                  "北碚区": [106.437868, 29.82543],
                  "渝北区": [106.512851, 29.601451],
                  "江北区": [106.532844, 29.575352],
                  "城口县": [108.6649, 31.946293],
                  "巫溪县": [109.628912, 31.3966],
                  "奉节县": [109.465774, 31.019967],
                  "丰都县": [107.73248, 29.866424],
                  "彭水苗族土家族自治县": [108.166551, 29.293856],
                  "秀山土家族苗族自治县": [108.996043, 28.444772],
                  "云阳县": [108.697698, 30.930529],
                  "巫山县": [109.878928, 31.074843],
                  "垫江县": [107.348692, 30.330012],
                  "酉阳土家族苗族自治县": [108.767201, 28.839828],
                  "石柱土家族自治县": [108.112448, 29.99853],
                  "忠县": [108.037518, 30.291537]
              }
          },
          "福建省": {
              "mapProvince": "fujian",
              "gsGeoCoordMap": {
                  "福州市": [119.306239, 26.075302],
                  "龙岩市": [117.02978, 25.091603],
                  "南平市": [118.178459, 26.635627],
                  "宁德市": [119.527082, 26.65924],
                  "莆田市": [119.007558, 25.431011],
                  "泉州市": [118.589421, 24.908853],
                  "三明市": [117.635001, 26.265444],
                  "厦门市": [118.11022, 24.490474],
                  "漳州市": [117.661801, 24.510897]
              }
          },
          "甘肃省": {
              "mapProvince": "gansu",
              "gsGeoCoordMap": {
                  "兰州市": [103.823557, 36.058039],
                  "白银市": [104.273606, 36.95568],
                  "定西市": [104.626294, 35.179578],
                  "甘南藏族自治州": [102.911008, 34.586354],
                  "金昌市": [102.187888, 38.514238],
                  "酒泉市": [96.110795, 39.944023],
                  "临夏回族自治州": [103.212006, 35.599446],
                  "陇南市": [104.929379, 33.388598],
                  "平凉市": [106.684691, 35.54279],
                  "庆阳市": [107.638372, 35.734218],
                  "天水市": [105.724998, 34.578529],
                  "武威市": [102.634697, 37.929996],
                  "张掖市": [100.455472, 38.932897],
                  "嘉峪关市": [98.277304, 39.786529]
              }
          },
          "河北省": {
              "mapProvince": "hebei",
              "gsGeoCoordMap": {
                  "石家庄市": [114.502461, 38.045474],
                  "唐山市": [118.175393, 39.635113],
                  "秦皇岛市": [119.586579, 39.942531],
                  "邯郸市": [114.490686, 36.612273],
                  "邢台市": [114.508851, 37.0682],
                  "保定市": [115.482331, 38.867657],
                  "张家口市": [114.884091, 40.811901],
                  "承德市": [117.939152, 40.976204],
                  "沧州市": [116.857461, 38.310582],
                  "廊坊市": [116.704441, 39.523927],
                  "衡水市": [115.665993, 37.735097]
              }
          },
          "河南省": {
              "mapProvince": "henan",
              "gsGeoCoordMap": {
                  "郑州市": [113.665412, 34.757975],
                  "开封市": [114.341447, 34.797049],
                  "洛阳市": [112.434468, 34.663041],
                  "平顶山市": [113.307718, 33.735241],
                  "安阳市": [114.352482, 36.103442],
                  "鹤壁市": [114.295444, 35.748236],
                  "新乡市": [113.883991, 35.302616],
                  "焦作市": [113.238266, 35.23904],
                  "濮阳市": [115.041299, 35.768234],
                  "许昌市": [113.826063, 34.022956],
                  "漯河市": [114.026405, 33.575855],
                  "三门峡市": [111.194099, 34.777338],
                  "南阳市": [112.540918, 32.999082],
                  "商丘市": [115.650497, 34.437054],
                  "信阳市": [114.075031, 32.123274],
                  "周口市": [114.649653, 33.620357],
                  "驻马店市": [114.024736, 32.980169],
                  "济源市": [112.590047, 35.090378]
              }
          },
          "黑龙江省": {
              "mapProvince": "heilongjiang",
              "gsGeoCoordMap": {
                  "哈尔滨市": [126.642464, 45.756967],
                  "齐齐哈尔市": [123.95792, 47.342081],
                  "鸡西市": [130.975966, 45.300046],
                  "鹤岗市": [130.277487, 47.332085],
                  "双鸭山市": [131.157304, 46.643442],
                  "大庆市": [125.11272, 46.590734],
                  "伊春市": [128.899396, 47.724775],
                  "佳木斯市": [130.361634, 46.809606],
                  "七台河市": [131.015584, 45.771266],
                  "牡丹江市": [129.618602, 44.582962],
                  "黑河市": [127.499023, 50.249585],
                  "绥化市": [126.99293, 46.637393],
                  "大兴安岭地区": [124.711526, 52.335262]
              }
          },
          "湖北省": {
              "mapProvince": "hubei",
              "gsGeoCoordMap": {
                  "武汉市": [114.298572, 30.584355],
                  "黄石市": [115.077048, 30.220074],
                  "十堰市": [110.787916, 32.646907],
                  "宜昌市": [111.290843, 30.702636],
                  "襄阳市": [112.144146, 32.042426],
                  "鄂州市": [114.890593, 30.396536],
                  "荆门市": [112.204251, 31.03542],
                  "孝感市": [113.926655, 30.926423],
                  "荆州市": [112.23813, 30.326857],
                  "黄冈市": [114.879365, 30.447711],
                  "咸宁市": [114.328963, 29.832798],
                  "随州市": [113.37377, 31.717497],
                  "恩施土家族苗族自治州": [109.48699, 30.283114],
                  "仙桃市": [113.453974, 30.364953],
                  "潜江市": [112.896866, 30.421215],
                  "天门市": [113.165862, 30.653061],
                  "神农架林区": [110.671525, 31.744449]
              }
          },
          "湖南省": {
              "mapProvince": "hunan",
              "gsGeoCoordMap": {
                  "常德市": [111.691347, 29.040225],
                  "郴州市": [113.032067, 25.793589],
                  "衡阳市": [112.607693, 26.900358],
                  "怀化市": [109.97824, 27.550082],
                  "娄底市": [112.008497, 27.728136],
                  "邵阳市": [111.46923, 27.237842],
                  "湘潭市": [112.944052, 27.82973],
                  "湘西土家族苗族自治州": [109.739735, 28.314296],
                  "益阳市": [112.355042, 28.570066],
                  "永州市": [111.608019, 26.434516],
                  "岳阳市": [113.132855, 29.37029],
                  "张家界市": [110.479921, 29.127401],
                  "长沙市": [112.982279, 28.19409],
                  "株洲市": [113.151737, 27.835806]
              }
          },
          "吉林省": {
              "mapProvince": "jilin",
              "gsGeoCoordMap": {
                  "长春市": [125.3245, 43.886841],
                  "吉林市": [126.55302, 43.843577],
                  "四平市": [124.370785, 43.170344],
                  "辽源市": [125.145349, 42.902692],
                  "通化市": [125.936501, 41.721177],
                  "白山市": [126.427839, 41.942505],
                  "松原市": [124.823608, 45.118243],
                  "白城市": [122.841114, 45.619026],
                  "延边朝鲜族自治州": [129.513228, 42.904823]
              }
          },
          "江苏省": {
              "mapProvince": "jiangsu",
              "gsGeoCoordMap": {
                  "南京市": [118.767413, 32.041544],
                  "无锡市": [120.301663, 31.574729],
                  "徐州市": [117.184811, 34.261792],
                  "常州市": [119.946973, 31.772752],
                  "苏州市": [120.619585, 31.299379],
                  "南通市": [120.864608, 32.016212],
                  "连云港市": [119.178821, 34.600018],
                  "淮安市": [119.021265, 33.597506],
                  "盐城市": [120.139998, 33.377631],
                  "扬州市": [119.421003, 32.393159],
                  "镇江市": [119.452753, 32.204402],
                  "泰州市": [119.915176, 32.484882],
                  "宿迁市": [118.275162, 33.963008]
              }
          },
          "江西省": {
              "mapProvince": "jiangxi",
              "gsGeoCoordMap": {
                  "抚州市": [116.358351, 27.98385],
                  "赣州市": [114.940278, 25.85097],
                  "吉安市": [114.986373, 27.111699],
                  "景德镇市": [117.214664, 29.29256],
                  "九江市": [115.992811, 29.712034],
                  "南昌市": [115.892151, 28.676493],
                  "萍乡市": [113.852186, 27.622946],
                  "上饶市": [117.971185, 28.44442],
                  "新余市": [114.930835, 27.810834],
                  "宜春市": [114.391136, 27.8043],
                  "鹰潭市": [117.033838, 28.238638]
              }
          },
          "辽宁省": {
              "mapProvince": "liaoning",
              "gsGeoCoordMap": {
                  "沈阳市": [123.429096, 41.796767],
                  "大连市": [121.618622, 38.91459],
                  "鞍山市": [122.995632, 41.110626],
                  "抚顺市": [123.921109, 41.875956],
                  "本溪市": [123.770519, 41.297909],
                  "丹东市": [124.383044, 40.124296],
                  "锦州市": [121.135742, 41.119269],
                  "营口市": [122.235151, 40.667432],
                  "阜新市": [121.648962, 42.011796],
                  "辽阳市": [123.18152, 41.269402],
                  "盘锦市": [122.06957, 41.124484],
                  "铁岭市": [123.844279, 42.290585],
                  "朝阳市": [120.451176, 41.576758],
                  "葫芦岛市": [120.856394, 40.755572]
              }
          },
          "内蒙古自治区": {
              "mapProvince": "neimenggu",
              "gsGeoCoordMap": {
                  "呼和浩特市": [111.670801, 40.818311],
                  "包头市": [109.840405, 40.658168],
                  "乌海市": [106.825563, 39.673734],
                  "赤峰市": [118.956806, 42.275317],
                  "通辽市": [122.263119, 43.617429],
                  "鄂尔多斯市": [109.99029, 39.817179],
                  "呼伦贝尔市": [119.758168, 49.215333],
                  "巴彦淖尔市": [107.416959, 40.757402],
                  "乌兰察布市": [113.114543, 41.034126],
                  "兴安盟": [122.070317, 46.076268],
                  "锡林郭勒盟": [116.090996, 43.944018],
                  "阿拉善盟": [105.706422, 38.844814]
              }
          },
          "宁夏回族自治区": {
              "mapProvince": "ningxia",
              "gsGeoCoordMap": {
                  
                  "固原市": [106.285241, 36.004561],
                  "石嘴山市": [106.376173, 39.01333],
                  "吴忠市": [106.199409, 37.986165],
                  "银川市": [106.278179, 38.46637],
                  "中卫市": [105.189568, 37.514951]
              }
          },
          "青海省": {
              "mapProvince": "qinghai",
              "gsGeoCoordMap": {
                  "果洛藏族自治州": [100.242143, 34.4736],
                  "海北藏族自治州": [100.901059, 36.959435],
                  "海东市": [102.10327, 36.502916],
                  "海南藏族自治州": [100.619542, 36.280353],
                  "海西蒙古族藏族自治州": [97.370785, 37.374663],
                  "黄南藏族自治州": [102.019988, 35.517744],
                  "西宁市": [101.778916, 36.623178],
                  "玉树藏族自治州": [97.008522, 33.004049]
              }
          },
          "山东省": {
              "mapProvince": "shandong",
              "gsGeoCoordMap": {
                  "济南市": [117.000923, 36.675807],
                  "青岛市": [120.355173, 36.082982],
                  "淄博市": [118.047648, 36.814939],
                  "枣庄市": [117.557964, 34.856424],
                  "东营市": [118.66471, 37.434564],
                  "烟台市": [121.391382, 37.539297],
                  "潍坊市": [119.107078, 36.70925],
                  "济宁市": [116.587245, 35.415393],
                  "泰安市": [117.129063, 36.194968],
                  "威海市": [122.116394, 37.509691],
                  "日照市": [119.461208, 35.428588],
                  "临沂市": [118.326443, 35.065282],
                  "德州市": [116.307428, 37.453968],
                  "聊城市": [115.980367, 36.456013],
                  "滨州市": [118.016974, 37.383542],
                  "菏泽市": [115.469381, 35.246531]
              }
          },
          "山西省": {
              "mapProvince": "shanxi",
              "gsGeoCoordMap": {
                  "太原市": [112.549248, 37.857014],
                  "大同市": [113.295259, 40.09031],
                  "阳泉市": [113.583285, 37.861188],
                  "长治市": [113.113556, 36.191112],
                  "晋城市": [112.851274, 35.497553],
                  "朔州市": [112.433387, 39.331261],
                  "晋中市": [112.736465, 37.696495],
                  "运城市": [111.003957, 35.022778],
                  "忻州市": [112.733538, 38.41769],
                  "临汾市": [111.517973, 36.08415],
                  "吕梁市": [111.134335, 37.524366]
              }
          },
          "陕西省": {
              "mapProvince": "shanxi1",
              "gsGeoCoordMap": {
                  "西安市": [108.948024, 34.263161],
                  "铜川市": [108.979608, 34.916582],
                  "宝鸡市": [107.14487, 34.369315],
                  "咸阳市": [108.705117, 34.333439],
                  "渭南市": [109.502882, 34.499381],
                  "延安市": [109.49081, 36.596537],
                  "汉中市": [107.028621, 33.077668],
                  "榆林市": [109.741193, 38.290162],
                  "安康市": [109.029273, 32.6903],
                  "商洛市": [109.939776, 33.868319]
              }
          },
          "上海市": {
              "mapProvince": "shanghai",
              "gsGeoCoordMap": {
                  "黄浦区": [121.490317, 31.222771],
                  "徐汇区": [121.43752, 31.179973],
                  "长宁区": [121.4222, 31.218123],
                  "静安区": [121.448224, 31.229003],
                  "普陀区": [121.392499, 31.241701],
                  "虹口区": [121.491832, 31.26097],
                  "杨浦区": [121.522797, 31.270755],
                  "闵行区": [121.375972, 31.111658],
                  "宝山区": [121.489934, 31.398896],
                  "嘉定区": [121.250333, 31.383524],
                  "浦东新区": [121.567706, 31.245944],
                  "金山区": [121.330736, 30.724697],
                  "松江区": [121.223543, 31.03047],
                  "青浦区": [121.113021, 31.151209],
                  "奉贤区": [121.458472, 30.912345],
                  "崇明区": [121.397516, 31.626946]
              }
          },
          "四川省": {
              "mapProvince": "sichuan",
              "gsGeoCoordMap": {
                  "成都市": [104.065735, 30.659462],
                  "自贡市": [104.773447, 29.352765],
                  "攀枝花市": [101.716007, 26.580446],
                  "泸州市": [105.443348, 28.889138],
                  "德阳市": [104.398651, 31.127991],
                  "绵阳市": [104.741722, 31.46402],
                  "广元市": [105.829757, 32.433668],
                  "遂宁市": [105.571331, 30.513311],
                  "内江市": [105.066138, 29.58708],
                  "乐山市": [103.761263, 29.582024],
                  "南充市": [106.082974, 30.795281],
                  "眉山市": [103.831788, 30.048318],
                  "宜宾市": [104.630825, 28.760189],
                  "广安市": [106.633369, 30.456398],
                  "达州市": [107.502262, 31.209484],
                  "雅安市": [103.001033, 29.987722],
                  "巴中市": [106.753669, 31.858809],
                  "资阳市": [104.641917, 30.122211],
                  "阿坝藏族羌族自治州": [102.221374, 31.899792],
                  "甘孜藏族自治州": [101.963815, 30.050663],
                  "凉山彝族自治州": [102.258746, 27.886762]
              }
          },
          "天津市": {
              "mapProvince": "tianjin",
              "gsGeoCoordMap": {
                  "和平区": [117.195907, 39.118327],
                  "河东区": [117.226568, 39.122125],
                  "河西区": [117.217536, 39.101897],
                  "南开区": [117.164143, 39.120474],
                  "河北区": [117.201569, 39.156632],
                  "红桥区": [117.163301, 39.175066],
                  "东丽区": [117.313967, 39.087764],
                  "西青区": [117.012247, 39.139446],
                  "津南区": [117.382549, 38.989577],
                  "北辰区": [117.13482, 39.225555],
                  "武清区": [117.057959, 39.376925],
                  "宝坻区": [117.308094, 39.716965],
                  "滨海新区": [117.654173, 39.032846],
                  "宁河区": [117.82828, 39.328886],
                  "静海区": [116.925304, 38.935671],
                  "蓟州区": [117.407449, 40.045342]
              }
          },
          "西藏自治区": {
              "mapProvince": "xizang",
              "gsGeoCoordMap": {
                  "阿里地区": [80.105498, 32.503187],
                  "昌都市": [97.178452, 31.136875],
                  "拉萨市": [91.132212, 29.660361],
                  "林芝市": [94.362348, 29.654693],
                  "那曲市": [92.060214, 31.476004],
                  "日喀则市": [88.885148, 29.267519],
                  "山南市": [91.766529, 29.236023]
              }
          },
          "新疆维吾尔族自治区": {
              "mapProvince": "xinjiang",
              "gsGeoCoordMap": {
                  "乌鲁木齐": [87.617733, 43.792818],
                  "克拉玛依": [84.873946, 45.595886],
                  "吐鲁番": [89.184078, 42.947613],
                  "哈密": [93.51316, 42.833248],
                  "昌吉": [87.304012, 44.014577],
                  "博州": [82.074778, 44.903258],
                  "巴州": [86.150969, 41.768552],
                  "阿克苏": [80.265068, 41.170712],
                  "克州": [76.172825, 39.713431],
                  "喀什": [75.989138, 39.467664],
                  "和田": [79.92533, 37.110687],
                  "伊犁": [81.317946, 43.92186],
                  "塔城": [82.985732, 46.746301],
                  "阿勒泰": [88.13963, 47.848393],
                //   "石河子市": [86.041075, 44.305886],
                //   "阿拉尔市": [81.285884, 40.541914],
                //   "图木舒克市": [79.077978, 39.867316],
                //   "五家渠市": [87.526884, 44.167401],
                //   "北屯市": [87.824932, 47.353177],
                //   "铁门关市": [85.501218, 41.827251],
                //   "双河市": [82.353656, 44.840524],
                //   "可克达拉市": [80.63579, 43.6832],
                //   "昆玉市": [79.287372, 37.207994]
              }
          },
          "浙江省": {
              "mapProvince": "zhejiang",
              "gsGeoCoordMap": {
                  "杭州市": [120.153576, 30.287459],
                  "湖州市": [120.102398, 30.867198],
                  "嘉兴市": [120.750865, 30.762653],
                  "金华市": [119.649506, 29.089524],
                  "丽水市": [119.921786, 28.451993],
                  "宁波市": [121.549792, 29.868388],
                  "衢州市": [118.87263, 28.941708],
                  "绍兴市": [120.582112, 29.997117],
                  "台州市": [121.428599, 28.661378],
                  "温州市": [120.672111, 28.000575],
                  "舟山市": [122.106863, 30.016028]
              }
          },
          "冀北": {
              "mapProvince": "hebei",
              "gsGeoCoordMap": {
                  "唐山市": [118.175393, 39.635113],
                  "张家口市": [114.884091, 40.811901],
                  "承德市": [117.939152, 40.976204],
                  "秦皇岛市": [119.586579, 39.942531],
                  "廊坊市": [116.704441, 39.523927],
                  "北京市": [116.41667,39.91667]
              }
          },
          "蒙东": {
              "mapProvince": "mengdong",
              "gsGeoCoordMap": {
                  "兴安盟": [122.070317, 46.076268],
                  "呼伦贝尔市": [119.758168, 49.215333],
                  "赤峰市": [118.956806, 42.275317],
                  "通辽市": [122.263119, 43.617429]
              }
          },
      },
        jsonDataURL: "",
        cityJsonURL: "",
        workStateOptions : [],
        workTypeOptions : [],
        riskLevelOtions : []
    };
  },
  created() {
    let that = this;
    
    // Promise.resolve({data:{code:0, data: '山东省'}}).then(suc => {
    getGsEchartsMap().then(suc => {
        if(suc.data.code == "0") {
            CURRENT_PROVINCE = suc.data.data;
            if (CURRENT_PROVINCE != "甘肃省") {
                $("#currentProvince").text(CURRENT_PROVINCE);
                that.jsonDataURL = "/static/city/" + CURRENT_PROVINCE + "/" + CURRENT_PROVINCE + ".geoJson";
                mapProvince = that.provinceMapInfo[CURRENT_PROVINCE].mapProvince;
                that.gsGeoCoordMap = that.provinceMapInfo[CURRENT_PROVINCE].gsGeoCoordMap;
                $(".back-gansu-map").addClass("back-gansu-map-border");
                if (CURRENT_PROVINCE == "冀北") {
                    $(".back-gansu-map").addClass("back-gansu-map-jibei");
                } else {
                    $(".back-gansu-map").addClass("back-gansu-map-" + mapProvince);
                }
            }
        }
        that.getCityInfo()
    })
  }, 

  mounted() {
    this.showGsEchartsMap()
  },

  methods: {
     /**
     * @description 获取字典信息
     * @param  // 风险信息 RMCP_WORKRISK_LEVEL 、作业类型 RMCP_SPECIALITY_TYPE 电压等级 RMCP_VOLTAGE_LEVEL 开工状态 RMCP_WORK_STATE
     * @crateTime 2020-08-27 09:00:16
     */
    getDictData() {
        let that = this;
        let params = [
            RMCP_WORK_STATE,
            RMCP_WORK_TYPE,
            RMCP_WORK_RISK_LEVEL
        ]
        dictionaryUnits.getDictListByArray(params).then(res => {
            that.workStateOptions = res[RMCP_WORK_STATE];
            that.workTypeOptions = res[RMCP_WORK_TYPE];
            that.riskLevelOtions = res[RMCP_WORK_RISK_LEVEL];
        })
    },

    /**
     * 字典转换
     */
    matchDict(data,options) {
        for (const k in options) {
            const el = options[k];
            if(data == el.value) {
              data = el.text;
              break;
            }
        }
        return data;
    },

    showGsEchartsMap(){
      let gsEchartMap = echarts.init(document.getElementById('gsEchartMap'));
    },

    convertData(data) {
        let res = [];
        for (let j = 0; j < data.length; j++) {
            let geoCoord = this.gsGeoCoordMap[data[j].name];
            if (geoCoord) {
                res.push({
                    name: data[j].name,
                    value: geoCoord.concat(data[j].value)
                });
            }
        }
        return res;
    },

    // 地市用户展示统计数据，单位用户直接展示计划点
    getCityInfo() {
        let shengfen = CURRENT_PROVINCE;
        if (shengfen == "冀北") {
            shengfen = "河北省"
        } else if (shengfen == "蒙东") {
            shengfen = "内蒙古自治区"
        }
        //拼装地址
        let fun = null;
        let param = {
            "prov": shengfen,
            "workriskLevel": this.riskLevels,
            "isToady": true
        }

        //要区分直辖市和省份
        if(this.cityNames.includes(shengfen)) {
            fun = getAreaByCity
        }else {
            fun = getCityByProv
        }
        
        // Promise.resolve({data:{code:0, data: []}}).then(res => {
        fun(param).then(res => {
            // this.gsEchartMap.clear();
            if (res.data.code == 0) {
                //0：单位，1：地市
                this.isCityFlg = "1";
                let list = res.data.data;
                if (this.isCityFlg == "1") {
                    this.initDs(list);
                } else if (this.isCityFlg == "0") {
                    this.initDw(list);
                }
            }
        });
    },
    /**
     * 加载地图
     */
    initDs(list) {
        let that = this;
        let _levelAllSymbolUrl = "image://" + that.levelSymbolUrl;
        let gsEchartMap = echarts.init(document.getElementById('gsEchartMap'));
        $.getJSON(that.jsonDataURL, function (geoJson) {
            echarts.registerMap(mapProvince, geoJson);
            that.option = {
                tooltip: {
                    //=========================================sunxiaomin==========================================
                    // position: ['6%', '55%'],改为悬浮框随鼠标移动,top、left、bottom、right鼠标所在图形上侧，左侧，下侧，右侧，
                    // transitionDuration:0,
                    confine: true, //是否将 tooltip 框限制在图表的区域内
                    enterable: true,
                    backgroundColor: "#0A144F",
                    padding: "0px",
                    trigger: "item",
                    triggerOn: "mousemove", //提示框触发的条件,'mousemove'鼠标移动时触发。'click'鼠标点击时触发。'mousemove|click'同时鼠标移动和点击时触发。'none'不在 'mousemove' 或 'click' 时触发 
                    //这是要做鼠标悬浮提示的文字信息
                    formatter: function (params) {
                        if (params && params.seriesType == "effectScatter" && params.name) { //判断是闪烁的点就提示信息
                            //这边判断是否移动过防止来回的去获取数据
                            if (that.mousemoveCityName != params.name) {
                                that.mousemoveCityName = params.name;
                                that.mousemoveText = ""; //清除原先的元素
                                that.getMapByCityName(params.name);
                            }
                            return that.mousemoveText;
                        }
                    }
                    //===================================================================================
                },
                geo: [
                    {
                        show: true,
                        map: mapProvince,
                        zoom: 1.2,
                        zlevel: 1,
                        scaleLimit: {
                            min: 1
                        },
                        label: {
                            emphasis: {
                                show: true,
                                color: '#fff'
                            },
                            show: true,
                            color: '#b8cefd'
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#00226e',
                                borderColor: '#00FFFF',
                                borderWidth: 0.1
                            }
                        },
                        emphasis: {
                            itemStyle: {
                                areaColor: "rgba(24, 77, 195, 1)",
                            }
                        }
                    },
                    {
                        show: true,
                        zlevel: 0,
                        map: mapProvince,
                        zoom: 1.2,
                        scaleLimit: {
                            min: 1
                        },
                        label: {
                            emphasis: {
                                show: true,
                                color: '#fff'
                            },
                            show: true,
                            color: '#b8cefd'
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                borderWidth: 3, //设置外层边框
                                borderColor: '#98e6ff',
                                shadowColor: '#000000',
                                shadowBlur: 20,
                                shadowOffsetX: -10,
                                shadowOffsetY: 10
                            }
                        },
                    },
                ],
                series: [{
                    type: 'map',
                    roam: true,
                    map: mapProvince,
                    geoIndex: 0,
                    data: []
                }, {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 100,
                    showEffectOn: 'emphasis',  
                    symbol: _levelAllSymbolUrl,
                    symbolSize: [38, 50],
                    rippleEffect: {
                        color: '#5a96c4',
                        period: 4,
                        scale: 1,
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            offset: [0, -6],
                            formatter: function (params) {
                                return params.data.value[2];
                            },
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 500
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                if (that.riskLevels == "") {
                                    return "#54db96";
                                } else if(that.riskLevels == "1006001"){
                                    return that.colorArr[1];
                                } else if(that.riskLevels == "1006002"){
                                    return that.colorArr[2];
                                } else if(that.riskLevels == "1006003"){
                                    return that.colorArr[3];
                                } else if(that.riskLevels == "1006004"){
                                    return that.colorArr[4];
                                }
                            }
                        }
                    },
                    data: []
                }]
            };
            let dsRiskList = []; // 地市
            let dwHtml = ''; // 二级单位
            //
            for (let item in list) {
                // list[k].cityType == "1"
                if (true) {
                    let dsitem = {
                        name: item,
                        value: list[item].length
                    }
                    dsRiskList.push(dsitem);
                } else if (list[k].cityType == "2") {
                    if (CURRENT_PROVINCE != "甘肃省" && (list[k].cityName == "刘家峡电厂" || list[k].cityName == "科源集团")) {
                        continue;
                    }
                    dwHtml += '<div class="dw-item">';
                    dwHtml += '<span class="dw-item-name">' + list[k].cityName + '</span>';
                    dwHtml += '<span class="dw-item-num">' + list[k].totalNum + '</span>';
                    dwHtml += '</div>';
                }
            }

            $("#sjxdzList").html(dwHtml);
            that.option.series[0].data = dsRiskList;
            that.option.series[1].data = that.convertData(dsRiskList);
            gsEchartMap.setOption(that.option);
            gsEchartMap.on("click", function (params) {
                if (params && params.name) {
                    if (that.clickCityName != params.name) {
                        that.clickCityName = params.name;
                        that.showCityMap(params.name, "");
                    }
                }
            });

            //geo同步
            gsEchartMap.on('georoam', function (params) {
                let option = gsEchartMap.getOption();//获得option对象
                if (params.zoom != null && params.zoom != undefined) { //捕捉到缩放时
                    option.geo[1].zoom = option.geo[0].zoom;//下层geo的缩放等级跟着上层的geo一起改变
                    option.geo[1].center = option.geo[0].center;//下层的geo的中心位置随着上层geo一起改变
                } else {//捕捉到拖曳时
                    option.geo[1].center = option.geo[0].center;//下层的geo的中心位置随着上层geo一起改变
                }
                gsEchartMap.setOption(option);//设置option
            })

            //二级单位列表点击事件
            $(".dw-item").click(function () {
                let dwName = $(this).find(".dw-item-name").text();
                $(".dw-item").removeClass("dw-risk-active");
                $(this).addClass("dw-risk-active");
                that.showCityMap(dwName, "2");
            });
        });
    },

    initDw(list) {
        let that = this;
        let gsEchartMap = echarts.init(document.getElementById('gsEchartMap'));
        $.getJSON(this.jsonDataURL, function (geoJson) {
            echarts2.registerMap(mapProvince, geoJson);
            option = {
                tooltip: {
                    position: "top",
                    backgroundColor: "rgba(50,50,50,0)",
                    trigger: "item",
                    padding: [0, 0, 0, 0],
                    textStyle: {
                        color: "#333333"
                    },
                    formatter: function (params, ticket, callback) {
                        if (!params.data || !params.data.workState) {
                            return;
                        }
                        let item = params.data;
                        let html = '';
                        html += '<div class="tooltip-hover">';
                        html += '<div class="tooltip-title">' + item.dayPlanName + '</div>';
                        html += "<div class='tooltip-hover-line'>";
                        html += '<div class="tooltip-sszy-icon tooltip-icon"></div><div class="tooltip-name">所属专业：</div><div class="tooltip-context">' + that.matchDict(item.workType,that.workTypeOptions) + '</div>';
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-didian-icon tooltip-icon'></div><div class='tooltip-name'>工作地点：</div><div class='tooltip-context'>" + item.workPlace + "</div>";
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-fuzeren-icon tooltip-icon'></div><div class='tooltip-name'>工作负责人：</div><div class='tooltip-context'>" + item.workManager + "</div>";
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-dianhua-icon tooltip-icon'></div><div class='tooltip-name'>联系方式：</div><div class='tooltip-context'>" + item.workManagerContact + "</div>";
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-fxdj-icon tooltip-icon'></div><div class='tooltip-name'>风险等级：</div><div class='tooltip-context'>" + that.matchDict(item.workriskLevel,that.riskLevelOtions) + "</div>";
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-zxzt-icon tooltip-icon'></div><div class='tooltip-name'>执行状态：</div><div class='tooltip-context'>" + that.matchDict(item.workState,that.workStateOptions) + "</div>";
                        html += "</div>";
                        html += '</div>';
                        return html;
                    }
                },
                geo: {
                    map: mapProvince,
                    scaleLimit: {
                        min: 0.8
                    },
                    label: {
                        emphasis: {
                            show: true,
                            color: '#FFFFFF'
                        },
                        normal: {
                            show: true,
                            color: '#FFFFFF'
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "rgba(13, 28, 113, 0.2)",
                            borderColor: "#93E5FD",
                            borderWidth: "2",
                            shadowColor: 'rgb(21, 202, 181)',
                            shadowBlur: 100
                        },
                        emphasis: {
                            areaColor: "rgba(40, 202, 178, 0.4)",
                            show: false
                        }
                    },
                    roam: true
                },
                series: [{
                    type: "scatter",
                    coordinateSystem: "geo",
                    geoIndex: 0,
                    label: {
                        normal: {
                            show: false,
                            position: "right",
                            formatter: "{b}"
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            show: true,
                            color: "#ffef34"
                        }
                    },
                    symbol: function (val, params) {
                        if (params.data.workState == '1007004') {
                            return _ywc;
                        } else if (params.data.workState == '1007002') {
                            return _zxz;
                        }
                    },
                    symbolSize: function (val, params) {
                        return [20, 20];
                    },
                    data: []
                }]
            };
            let seriesList = []
            for (let i in list) {
                for (let j = 0; j < list[i].length; i++) {
                    seriesList[i].value = [list[i][j].longitude, list[i][j].latitude];
                }

            }
            option.series[0].data = seriesList;
            gsEchartMap.setOption(option);
        });
    },
    // 顶部风险等级点击事件
    riskLevel(event,level) {
        let that = this;
        $(".dw-item").removeClass("dw-risk-active");
        switch (level) {
            case '1006001':
                that.levelSymbolUrl = level1lSymbolUrl
                break;
            case '1006002':
                that.levelSymbolUrl = level2SymbolUrl
                break;
            case '1006003':
                that.levelSymbolUrl = level3SymbolUrl
                break;
            case '1006004':
                that.levelSymbolUrl = level4SymbolUrl
                break;
            default: 
                that.levelSymbolUrl = levelAllSymbolUrl
        }
        if (that.riskLevels != level) {
            //     //添加了全部按钮，去掉这边点击两次后查全部
            //     riskLevels = "";
            //     $(".risk-level").removeClass("risk-active");
            // } else {
            $(".risk-level").removeClass("risk-active");
            $(event.currentTarget).addClass("risk-active");
            that.riskLevels = level;
            //================添加省份判断============================
            var shengfen = CURRENT_PROVINCE;
            if (shengfen == "冀北") {
                shengfen = "河北省"
            } else if (shengfen == "蒙东") {
                shengfen = "内蒙古自治区"
            }
            //拼装地址
            var param = {
                prov: shengfen,
                workriskLevel: that.riskLevels,
                isToady: true
            }

            //要区分直辖市和省份
            for (var i = 0; i < that.cityNames.length; i++) {
                if (shengfen == that.cityNames[i]) {
                    param = {
                        city: shengfen,
                        workriskLevel: that.riskLevels,
                        isToady: true
                    }
                    break;
                }
            }

            // 地市用户展示统计数据，单位用户直接展示计划点
            getCityByProv(param).then(suc => {
                if (suc.data.code == "0") {
                    // isCityFlg = data.resultValue.isCityFlg; //0：单位，1：地市
                    that.isCityFlg = "1";
                    var list = suc.data.data;
                    if (that.isCityFlg == "1") {
                        that.initDs(list);
                    } else if (that.isCityFlg == "0") {
                        that.initDw(list);
                    }
                }
            })
        }
    },
        
    // 返回省地图点击事件
    backProvinceMap() {
        this.clickCityName = "";
        $("#gsEchartMap,#sjxdzList,.risk-query-list").show();
        $("#gsCityEchartMap,.risk-legend,.back-gansu-map").hide();
        $("#riskYwc").text("");
        $("#riskZxz").text("");
        // 地市用户展示统计数据，单位用户直接展示计划点
        //===================================================================
        let shengfen = CURRENT_PROVINCE;
        if (shengfen == "冀北") {
            shengfen = "河北省"
        } else if (shengfen == "蒙东") {
            shengfen = "内蒙古自治区"
        }
        let param = {
            prov: shengfen,
            workriskLevel: this.riskLevels,
            isToady: true
        }
        //要区分直辖市和省份
        for (let i = 0; i < this.cityNames.length; i++) {
            if (shengfen == this.cityNames[i]) {
                param = {
                    city: shengfen,
                    workriskLevel: this.riskLevels,
                    isToady: true
                }
            }
        }
        let that = this;
        //要区分直辖市和省份
        let fun = null;
        if(this.cityNames.includes(shengfen)) {
            fun = getAreaByCity;
        } else {
            fun = getCityByProv;
        }
        //发送数据
        fun(param).then(suc => {
            function clear() {
                that.gsEchartMap()
            };
            if (suc.data.code == "0") {
                // isCityFlg = suc.resultValue.isCityFlg; //0：单位，1：地市
                that.isCityFlg = "1";
                let list = suc.data.data;
                if (that.isCityFlg == "1") {
                    that.initDs(list);
                } else if (that.isCityFlg == "0") {
                    that.initDw(list);
                }
            }
        })
    },
    
    /*
    * 显示地市地图/二级单位计划
    * cityName 地市名
    * type 地市地图/二级单位
    */
    showCityMap(cityName, type) {
        let that = this;
        let cityMap;
        let cityJsonURL;
        let mapLevel;
        if (type == "2") {
            $("#gsEchartMap,#sjxdzList,.risk-query-list").show();
            $("#gsCityEchartMap,.risk-legend,.back-gansu-map").hide();
            cityMap = echarts.init(document.getElementById('gsEchartMap'));
            that.cityJsonURL = that.jsonDataURL;
            mapLevel = "";
        } else {
            $("#gsEchartMap,#sjxdzList,.risk-query-list").hide();
            $("#gsCityEchartMap,.risk-legend,.back-gansu-map").show();
            cityMap = echarts.init(document.getElementById('gsCityEchartMap'));
            that.cityJsonURL = "../../../static/city/" + CURRENT_PROVINCE + "/" + cityName + ".geoJson";
            mapLevel = that.riskLevels;
        }
        if (type != "2") {
            cityMap.clear();
        }
        $.getJSON(that.cityJsonURL, function (geoJson) {
            echarts.registerMap('city', geoJson);
            let cityOption = {
                tooltip: {
                    position: "top",
                    backgroundColor: "rgba(50,50,50,0)",
                    trigger: "item",
                    padding: [0, 0, 0, 0],
                    textStyle: {
                        color: "#333333"
                    },
                    formatter: function (params, ticket, callback) {
                        if (!params.data || !params.data.workState) {
                            return;
                        }
                        let item = params.data;
                        let html = '';
                        html += '<div class="tooltip-hover">';
                        html += '<div class="tooltip-title">' + item.dayPlanName + '</div>';
                        html += "<div class='tooltip-hover-line'>";
                        html += '<div class="tooltip-sszy-icon tooltip-icon"></div><div class="tooltip-name">所属专业：</div><div class="tooltip-context">' + that.matchDict(item.workType,that.workTypeOptions) + '</div>';
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-didian-icon tooltip-icon'></div><div class='tooltip-name'>工作地点：</div><div class='tooltip-context'>" + item.workPlace + "</div>";
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-fuzeren-icon tooltip-icon'></div><div class='tooltip-name'>工作负责人：</div><div class='tooltip-context'>" + item.workManager + "</div>";
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-dianhua-icon tooltip-icon'></div><div class='tooltip-name'>联系方式：</div><div class='tooltip-context'>" + item.workManagerContact + "</div>";
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-fxdj-icon tooltip-icon'></div><div class='tooltip-name'>风险等级：</div><div class='tooltip-context'>" + that.matchDict(item.workriskLevel,that.riskLevelOtions) + "</div>";
                        html += "</div>";
                        html += "<div class='tooltip-hover-line'>";
                        html += "<div class='tooltip-zxzt-icon tooltip-icon'></div><div class='tooltip-name'>执行状态：</div><div class='tooltip-context'>" + that.matchDict(item.workState,that.workStateOptions) + "</div>";
                        html += "</div>";
                        html += '</div>';
                        return html;
                    }
                },
                geo: {
                    zlevel: 2,
                    map: "city",
                    scaleLimit: {
                        min: 0.8
                    },
                    label: {
                        emphasis: {
                            show: true,
                            color: '#FFFFFF'
                        },
                        normal: {
                            show: true,
                            color: '#FFFFFF'
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "rgba(13, 28, 113, 0.2)",
                            borderColor: "#93E5FD",
                            borderWidth: "2",
                            shadowColor: 'rgb(21, 202, 181)',
                            shadowBlur: 100
                        },
                        emphasis: {
                            areaColor: "rgba(40, 202, 178, 0.4)",
                            show: false
                        }
                    },
                    roam: true
                },
                series: [{
                    type: "scatter",
                    coordinateSystem: "geo",
                    label: {
                        normal: {
                            show: false,
                            position: "right",
                            formatter: "{b}"
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            show: true,
                            color: "#ffef34"
                        }
                    },
                    symbol: function (val, params) {
                        if (params.data.workState == '1007004') {
                            return _ywc;
                        } else if (params.data.workState == '1007002') {
                            return _zxz;
                        }
                    },
                    symbolSize: function (val, params) {
                        return [20, 20];
                    },
                    data: []
                },
                // =====================这是地图闪烁的操作==========sunxiaomin=============================
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    data: [],
                    symbolSize: function (val) {
                        if (val[2] && val[2] > 250) {
                            return val[2] / 10;
                        } else {
                            return 25;
                        }
                    },
                    label: {
                        normal: {
                            formatter: function (params) {
                                return params.data.value[2];
                            },
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 500
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                if (that.riskLevels == "") {
                                    return "#4cf580";
                                } else if(that.riskLevels == "1006001"){
                                    return that.colorArr[1];
                                } else if(that.riskLevels == "1006002"){
                                    return that.colorArr[2];
                                } else if(that.riskLevels == "1006003"){
                                    return that.colorArr[3];
                                } else if(that.riskLevels == "1006004"){
                                    return that.colorArr[4];
                                }
                            }
                        }
                    },
                    zlevel: 1
                }
                    //==============================================================================
                ]
            };

            let param = {
                city: cityName,
                isToady: true
            }
            //要区分直辖市和省份
            for (let i = 0; i < that.cityNames.length; i++) {
                if (CURRENT_PROVINCE == that.cityNames[i]) {
                    param = {
                        area: cityName,
                        isToady: true
                    }
                }
            }
            // 数据请求
            getAreaByCity(param).then(suc => {
                if (type == "2") {
                    cityMap.clear();
                } 
                if (suc.data.code == "0") {
                    let riskList = suc.data.data
                    let zxzNum = 0;
                    let ywcNum = 0;
                    let list = [];
                    let res = [];
                    for (let item in riskList) {
                        for (let i = 0; i < riskList[item].length; i++) {
                            res.push({
                                name: item,
                                value: [riskList[item][i].longitude, riskList[item][i].latitude, 1]
                            });
                            list.push(riskList[item][i]);
                            list[i].value = [riskList[item][i].longitude, riskList[item][i].latitude];
                            list[i].name = item;
                            if (riskList[item][i].workState == '1007004') { //已完成
                                ywcNum++;
                            }
                            if (riskList[item][i].workState == '1007002') { //执行中
                                zxzNum++;
                            }
                        }
                    }
                    cityOption.series[0].data = list;
                    //======================================================================================                        
                    cityOption.series[1].data = res;

                    cityMap.setOption(cityOption);
                    $("#riskYwc").text(ywcNum);
                    $("#riskZxz").text(zxzNum);
                }
            })
        });
    }, 
    // ================================================jinshengquan===================================
    getMapByCityName(cityName) {
        let shengfen = CURRENT_PROVINCE;
        //拼装地址
        let param = {
            city: cityName,
            isToady: true
        }
        //要区分直辖市和省份
        for (let i = 0; i < this.cityNames.length; i++) {
            if (shengfen == this.cityNames[i]) {
                param = {
                    area: cityName,
                    isToady: true
                }
            }
        }
        // 数据请求
        getAreaList(param).then(res => {
            if (res.data.code == 0) {
                let riskList = res.data.data;
                let zxzNum1 = 0; //执行中==风险等级一
                let ywcNum1 = 0; //已完成==风险等级一
                let wkgNum1 = 0; //未开工==风险等级一

                let zxzNum2 = 0; //执行中==风险等级二
                let ywcNum2 = 0; //已完成==风险等级二
                let wkgNum2 = 0; //未开工==风险等级二

                let zxzNum3 = 0; //执行中==风险等级三
                let ywcNum3 = 0; //已完成==风险等级三
                let wkgNum3 = 0; //未开工==风险等级三

                let zxzNum4 = 0; //执行中==风险等级四
                let ywcNum4 = 0; //已完成==风险等级四
                let wkgNum4 = 0; //未开工==风险等级四

                for (let work of riskList) {
                    if (work.workriskLevel == "1006001") { //风险等级一
                        if (work.workState == '1007004') { //已完成
                            ywcNum1++;
                        } else if (work.workState == '1007002') { //执行中
                            zxzNum1++;
                        } else if (work.workState == '1007001') { //未开工
                            wkgNum1++;
                        }
                    } else if (work.workriskLevel == "1006002") { //风险等级二
                        if (work.workState == '1007004') { //已完成
                            ywcNum2++;
                        } else if (work.workState == '1007002') { //执行中
                            zxzNum2++;
                        } else if (work.workState == '1007001') { //未开工
                            wkgNum2++;
                        }
                    } else if (work.workriskLevel == "1006003") { //风险等级三
                        if (work.workState == '1007004') { //已完成
                            ywcNum3++;
                        } else if (work.workState == '1007002') { //执行中
                            zxzNum3++;
                        } else if (work.workState == '1007001') { //未开工
                            wkgNum3++;
                        }
                    } else if (work.workriskLevel == "1006004") { //风险等级四
                        if (work.workState == '1007004') { //已完成
                            ywcNum4++;
                        } else if (work.workState == '1007002') { //执行中
                            zxzNum4++;
                        } else if (work.workState == '1007001') { //未开工
                            wkgNum4++;
                        }
                    }
                }
                //计算总数
                let wkgNum = wkgNum1 + wkgNum2 + wkgNum3 + wkgNum4;
                let zxzNum = zxzNum1 + zxzNum2 + zxzNum3 + zxzNum4;
                let ywcNum = ywcNum1 + ywcNum2 + ywcNum3 + ywcNum4;
                //这边开始拼装要显示的信息1.下面是施工情况
                this.mousemoveText += "<div class='ditutishi'>";
                this.mousemoveText += "<div class='shigongqingkuang'>";
                this.mousemoveText += "<div class='syqk-div'>";
                this.mousemoveText += "<div><span>未开工</span><span>" + wkgNum;
                this.mousemoveText += "</span></div></div>";
                this.mousemoveText += "<div class='syqk-div'>";
                this.mousemoveText += "<div><span>已开工</span><span>" + zxzNum;
                this.mousemoveText += "</span></div></div>";
                this.mousemoveText += "<div class='syqk-div'>";
                this.mousemoveText += "<div><span>已完工</span><span>" + ywcNum;
                this.mousemoveText += "</span></div></div></div>";
                // 2.下面是具体到风险等级
                this.mousemoveText += "<div class='guanzhugongsi'><ul>";
                //2-4：这是风险四级
                this.mousemoveText += "<li>";
                this.mousemoveText += "<div>四级</div>";
                this.mousemoveText += "<div>未开工<span>" + wkgNum4 + "</span></div>";
                this.mousemoveText += "<div>已开工<span>" + zxzNum4 + "</span></div>";
                this.mousemoveText += "<div>已完工<span>" + ywcNum4 + "</span></div>";
                this.mousemoveText += "</li>";

                //2-3：这是风险三级
                this.mousemoveText += "<li>";
                this.mousemoveText += "<div>三级</div>";
                this.mousemoveText += "<div>未开工<span>" + wkgNum3 + "</span></div>";
                this.mousemoveText += "<div>已开工<span>" + zxzNum3 + "</span></div>";
                this.mousemoveText += "<div>已完工<span>" + ywcNum3 + "</span></div>";
                this.mousemoveText += "</li>";

                //2-2：这是风险二级
                this.mousemoveText += "<li>";
                this.mousemoveText += "<div>二级</div>";
                this.mousemoveText += "<div>未开工<span>" + wkgNum2 + "</span></div>";
                this.mousemoveText += "<div>已开工<span>" + zxzNum2 + "</span></div>";
                this.mousemoveText += "<div>已完工<span>" + ywcNum2 + "</span></div>";
                this.mousemoveText += "</li>";

                //2-1：这是风险一级
                this.mousemoveText += "<li>";
                this.mousemoveText += "<div>一级</div>";
                this.mousemoveText += "<div>未开工<span>" + wkgNum1 + "</span></div>";
                this.mousemoveText += "<div>已开工<span>" + zxzNum1 + "</span></div>";
                this.mousemoveText += "<div>已完工<span>" + ywcNum1 + "</span></div>";
                this.mousemoveText += "</li>";

                //2:这是结束
                this.mousemoveText += "</ul></div>";
                this.mousemoveText += "</div>";
            } else {
                this.mousemoveText = "";
            }
        }) 
    },
    // ===================================================================================
  },
};
</script>
<style lang="scss" scoped>
  .risk-level-list {
    position: relative;
    height: 70%;
  }

  .dw-risk-active {
        cursor: default !important;
        background-color: rgba(21, 199, 178, 0.2) !important;
    }

    .dw-item-num {
        color: #E9E638;
        font-size: 18px;
        padding-left: 20px;
    }

    .dw-item:hover {
        background-color: rgba(21, 199, 178, 0.2) !important;
    }

    .dw-item {
        cursor: pointer;
        width: 160px;
        line-height: 38px;
        text-align: center;
        float: left;
        background-color: rgba(21, 199, 178, 0.1);
        box-sizing: border-box;
        /* border: 1px solid rgba(21, 199, 178, 0.3); */
    }

    #currentProvince {
        top: 0px;
        right: 30px;
        z-index: 12;
        color: #FFFFFF;
        font-size: 16px;
        font-family: 微软雅黑;
        width: 300px;
        height: 30px;
        padding-left: 20px;
        text-align: left;
        line-height: 30px;
        cursor: auto;
        background: url('../../../assets/images/home/location-icon.png');
        background-repeat: no-repeat;
        background-position: left center;
        position: absolute;
    }

    /* 监控中心的入口按钮 */
    #surveillanceCenter-entrance {
        position: absolute;
        width: 130px;
        height: 43px;
        z-index: 12;
        cursor: pointer;
        line-height: 43px;
        text-align: right;
        padding-right: 27px;
        font-family: 微软雅黑;
        font-size: 16px;
        color: white;
        border-radius: 3px;
        background-repeat: no-repeat;
        background-position: left center;
        background: url('../../../assets/images/surveillanceCenter/icon.png');
    }

    .sjxdz-list {
        position: absolute;
        right: 30px;
        top: 30px;
        z-index: 12;
        color: #b8cefd;
        font-size: 12px;
        width: 320px;
        background-image: url('../../../assets/images/home/wsgs-bg.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .risk-num {
        font-size: 20px;
        padding-left: 5px;
        color: #b8cefd;
    }

    .risk-legend-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 35px;
    }

    .point-div {
        width: 8px;
        height: 8px;
        margin-right: 15px;
        border-radius: 4px;
    }

    .back-gansu-map {
        position: absolute;
        right: 20px;
        bottom: 25px;
        width: 160px;
        height: 120px;
        background-image: url(../../../assets/images/gs-min.png);
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
        z-index: 2004;
        cursor: pointer;
        display: none;
    }

    .back-gansu-map-border {
        border: 1px solid #25B9AB;
    }

    .back-gansu-map-anhui {
        background-image: url('../../../assets/images/minMap/anhui.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-beijing {
        background-image: url('../../../assets/images/minMap/beijing.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-chongqing {
        background-image: url('../../../assets/images/minMap/chongqing.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-fujian {
        background-image: url('../../../assets/images/minMap/fujian.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-hebei {
        background-image: url('../../../assets/images/minMap/hebei.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-henan {
        background-image: url('../../../assets/images/minMap/henan.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-heilongjiang {
        background-image: url('../../../assets/images/minMap/heilongjiang.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-hubei {
        background-image: url('../../../assets/images/minMap/hubei.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-hunan {
        background-image: url('../../../assets/images/minMap/hunan.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-jilin {
        background-image: url('../../../assets/images/minMap/jilin.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-jiangsu {
        background-image: url('../../../assets/images/minMap/jiangsu.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-jiangxi {
        background-image: url('../../../assets/images/minMap/jiangxi.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-liaoning {
        background-image: url('../../../assets/images/minMap/liaoning.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-neimenggu {
        background-image: url('../../../assets/images/minMap/neimenggu.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-ningxia {
        background-image: url('../../../assets/images/minMap/ningxia.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-qinghai {
        background-image: url('../../../assets/images/minMap/qinghai.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-shandong {
        background-image: url('../../../assets/images/minMap/shandong.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-shanxi {
        background-image: url('../../../assets/images/minMap/shanxi.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-shanxi1 {
        background-image: url('../../../assets/images/minMap/shanxi1.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-shanghai {
        background-image: url('../../../assets/images/minMap/shanghai.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-sichuan {
        background-image: url('../../../assets/images/minMap/sichuan.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-tianjin {
        background-image: url('../../../assets/images/minMap/tianjin.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-xizang {
        background-image: url('../../../assets/images/minMap/xizang.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-xinjiang {
        background-image: url('../../../assets/images/minMap/xinjiang.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-zhejiang {
        background-image: url('../../../assets/images/minMap/zhejiang.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .back-gansu-map-jibei {
        background-image: url('../../../assets/images/minMap/jibei.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .risk-legend {
        position: absolute;
        left: 38px;
        bottom: 25px;
        z-index: 2004;
        color: #fff;
        font-size: 14px;
        display: none;
    }

    /deep/ .risk-active {
        cursor: default !important;
        background-image: url('../../../assets/images/home/zydj-selected.png') !important;
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .risk-level:hover {
        background-image: url('../../../assets/images/home/zydj-selected.png') !important;
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .risk-level {
        height: 30px;
        width: 84px;
        margin-top: 1px;
        color: rgb(255, 255, 255);
        opacity: 0.9;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #134b54;
        cursor: pointer;
        background-image: url('../../../assets/images/home/zydj-bg.png');
        background-repeat: no-repeat;
        -webkit-background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
    }

    .risk-line {
        margin-top: 19px;
        border-top: 1px solid #134b54;
        width: 20px;
    }

    .risk-query-list {
        left: 0px;
        bottom: 0px;
        z-index: 12;
        position: absolute;
    }

    .gan-su-city-map {
        width: 100%;
        height: 100%;
        display: none;
        position: absolute;
    }

    .gan-su-map {
        width: 100%;
        height: 100%;
        position: absolute;
        box-sizing: border-box;
        padding: 30px 0 0 85px;
    }

    .tooltip-name {
        min-width: 70px;
        font-size: 12px;
        color: rgb(223, 247, 244);
        opacity: 0.8;
    }

    .tooltip-context {
        max-width: 256px;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        font-size: 12px;
        color: rgb(223, 247, 244);
        opacity: 0.8;
    }

    .tooltip-icon {
        width: 12px;
        height: 12px;
        margin-right: 10px;
    }

    .tooltip-zxzt-icon {
        background: url(../../../assets/images/zhuangtai.png) no-repeat;
        background-size: 100% 100%;
    }

    .tooltip-fxdj-icon {
        background: url(../../../assets/images/dengji.png) no-repeat;
        background-size: 100% 100%;
    }

    .tooltip-dianhua-icon {
        background: url(../../../assets/images/dianhua.png) no-repeat;
        background-size: 100% 100%;
    }

    .tooltip-fuzeren-icon {
        background: url(../../../assets/images/fuzeren.png) no-repeat;
        background-size: 100% 100%;
    }

    .tooltip-didian-icon {
        background: url(../../../assets/images/didian-map.png) no-repeat;
        background-size: 100% 100%;
    }

    .tooltip-sszy-icon {
        background: url(../../../assets/images/zhuanye.png) no-repeat;
        background-size: 100% 100%;
    }

    .tooltip-hover-line {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }

    .tooltip-title {
        max-width: 97%;
        width: inherit;
        text-align: left;
        white-space: normal;
        font-size: 16px;
        color: #15cab5;
        padding-bottom: 25px;
    }

    .tooltip-hover {
        max-width: 500px;
        min-width: 350px;
        background-color: transparent;
        background: url(../../../assets/images/map-toop-bg.png) no-repeat;
        background-size: 100% 100%;
        padding: 20px 0 30px 15px;
        font-size: 14px;
        color: #c4d6ea;
        box-sizing: border-box;
    }

    /************************** sunXiaoMin 这边是为了地图悬浮提示的样式 ********************/
    /****************这是整个提示框的样式*********/

    /deep/ .ditutishi {
        width: 350px;
        color: #879CD3;
        border: 1px solid #3E5598;
        padding: 1px;
    }

    /****************这是施工情况的样式***********************/

    /deep/ .shigongqingkuang {
        background-color: #1259B5;
    }

    /deep/ .syqk-div {
        width: 32%;
        height: 60px;
        display: inline-block;
    }

    /deep/ .syqk-div:nth-child(1),
    /deep/ .syqk-div:nth-child(2) {
        border-right: 1px solid #0B1751;
    }

    /deep/ .syqk-div div {
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
    }

    /deep/ .syqk-div span {
        display: block;
    }

    /deep/ .syqk-div div>span:last-child {
        color: #FFF828;
        font-size: 32px;
        margin-top: 10px;
    }

    /*****************************这是下面风险等级的样式**********/

    /deep/ .guanzhugongsi ul {
        margin: 0px;
        padding: 0px;
    }

    /deep/ .guanzhugongsi li {
        list-style: none;
        padding: 8px;
        border-bottom: 1px solid #000000;
    }

    /deep/ .guanzhugongsi li:nth-child(4) {
        background-color: #11236F;
    }

    /deep/ .guanzhugongsi li:nth-child(4)>div:first-child {
        color: #a4b5f7;
    }

    /deep/ .guanzhugongsi li:nth-child(3) {
        background-color: #363C4C;
    }

    /deep/ .guanzhugongsi li:nth-child(3)>div:first-child {
        color: #FFFF00;
    }

    /deep/ .guanzhugongsi li:nth-child(2) {
        background-color: #362641;
    }

    /deep/ .guanzhugongsi li:nth-child(2)>div:first-child {
        color: #FF9900;
    }

    /deep/ .guanzhugongsi li:nth-child(1) {
        background-color: #301246;
    }

    /deep/ .guanzhugongsi li:nth-child(1)>div:first-child {
        color: #FF0000;
    }

    /deep/ .guanzhugongsi li>div {
        display: inline-block;
        margin-left: 8px;
    }

    /deep/ .guanzhugongsi li>div:nth-child(2) {
        margin-left: 16px;
    }

    /deep/ .guanzhugongsi li>div:nth-child(2),
    /deep/ .guanzhugongsi li>div:nth-child(3),
    /deep/ .guanzhugongsi li>div:nth-child(4) {
        width: 80px;
    }

    /deep/ .guanzhugongsi li>div span {
        display: inline-block;
        width: 25px;
        margin-left: 3px;
        color: white;
        text-align: center;
    }

    /* ******************************************************** */
</style>

<template>
  <div id="main">
    <div class="mainer" style="display: flex;">
      <div class="page_index" style="-moz-box-flex: 1;flex: 1;">
        <div v-show="$isAuth('home:salesTrend')" class="index_ech" style="margin-bottom: 15px;">
          <div class="tit index_box">
            <p style="line-height: 280%"><span style="display: none">PC均价：&nbsp;&nbsp;{{this.groupInfo.avgPcPrice}}/m³</span><span v-if="!isAllCompanyFlag">业绩排名：&nbsp;&nbsp;{{this.operatorAmountRank}}</span><span v-if="!isAllCompanyFlag">质量排名：&nbsp;&nbsp;{{this.operatorQuanityRank}}</span>
              <!--<select v-model="changeType" id="echartsDataType" style="border: none; background: none; font-size: 13px;margin-right: 10px;color: #00437c;width: 90px;float: right;margin-top: 8px;border-radius: 5px;" placeholder="选择公司" v-on:change="changeGraphicCompany()">
                <option value="">数据类型</option>
                <option v-for="item in echartsDataTypes" v-bind:value="item.id">{{item.name}}</option>
              </select>-->
              <span style="float: right;border-left:none;margin-right: 30px;margin-top: 10px;">
                <a><span style="border-left:none;opacity:0.5;color: #00437c;" id="week" @click="changeTypeToWeek">按周</span></a>
                <a><span style="border-left:none;opacity:0.5;color: #00437c;" id="month" @click="changeTypeToMonth">按月</span></a>
                <a><span style="border-left:none;color: #00437c;" id="quarter" @click="changeTypeToQuarter">按季度</span></a>
                <a><span style="border-left:none;opacity:0.5;color: #00437c;" id="year" @click="changeTypeToYear">按年</span></a>
              </span>
              <select v-if="$isAuth('home:select')" id="companyId" style="font-weight: bold;float: left;margin-left: 65px; border: none; background: none; font-size: 13px; color: #00437c;width: 90px;margin-top: 12px;border-radius: 5px;" placeholder="选择公司" v-on:change="changeGraphicCompany()">
                <option value="">全部公司</option>
                <option v-for="item in companys" v-bind:value="item.id" :key="item.id">{{item.name}}</option>
              </select>
              <select v-if="!$isAuth('home:select')" style="font-weight: bold;float: left;margin-left: 65px; border: none; background: none; font-size: 13px; color: #00437c;width: 90px;margin-top: 12px;border-radius: 5px;">
                <option value="">全部公司</option>
              </select>
            </p>
            <div class="list">
              <ul>
                <!--<li><a href="#">按周</a></li>-->
                <!--<li class="on"><a href="#">按月</a></li>-->
                <!--<li><a href="#">按季</a></li>-->
                <!--<li><a href="#">按年</a></li>-->
              </ul>
              <div class="clear"></div>
            </div>
          </div>
          <div class="ech_box index_box">
            <div class="echarts">
              <!--<img src="../../assets/home/img/img2.jpg" />-->
              <div id="box" style="height: 350px"></div>
            </div>
          </div>
        </div>
        <div v-show="$isAuth('home:salesData')" class="index_sczb index_box">
          <div class="index_tit">
            <h3><em style="color: black">市场指标</em><span style="margin-top: 50px">
                <!--<select id="companyId2" style="border: none;float: right; background: none; font-size: 13px; color: #00437c;width: 90px;margin-right: 5px; margin-top: 6px;border-radius: 5px;" placeholder="选择公司" v-on:change="queryGroupInfoByTimeRange()">
                  <option value="">全部公司</option>
                  <option v-for="item in companys"  v-bind:value="item.id">{{item.name}}</option>
                </select>-->
                <DatePicker type="daterange" v-model="timeRange" confirm size="small" style="float: right;width:12rem;margin-right:35px;margin-top: 5px" @on-ok="queryGroupInfoByTimeRange" @on-clear="queryGroupInfoByTimeRange2"></DatePicker>
                </span></h3>
            <div></div>
          </div>

          <div class="list">
            <ul>
              <li>
                <div class="box">
                  <p><span class="span1">签约金额（万）</span></p>
                  <a><font @click="jump(0)" v-html="groupInfo.amount">0</font></a>
                </div>
              </li>
              <li>
                <div class="box">
                  <p><span class="span2">中标金额（万）</span></p>
                  <a><font @click="jump(1)" v-html="groupInfo.biddingAmount"></font></a>
                </div>
              </li>
              <li>
                <div class="box">
                  <p><span class="span3">目标（万）</span></p>
                  <font v-html="groupInfo.targetAmount"></font>
                  <div class="drop">
                    <div class="cont">
                      <p>完成率</p>
                      <font  v-html="groupInfo.completeRate"></font>
                      <div class="wcl"><label :style="{'height':groupInfo.completeRate}"></label></div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div class="box">
                  <p><span class="span4">项目质量（分）</span></p>
                  <a :href ="'#/project/project'" ><font v-html="groupInfo.projectQuality"></font></a>
                </div>
              </li>
              <li>
                <div class="box">
                  <p><span class="span5">团队能力（万/组）</span></p>
                  <font v-html="groupInfo.groupTargetStr">0</font>
                </div>
              </li>
              <li>
                <div class="box">
                  <p><span class="span6">交付项目（个）</span></p>
                  <a><font @click="jump(2)" v-html="groupInfo.startCount"></font></a>
                </div>
              </li>
              <li>
                <div class="box">
                  <p><span class="span7">异常反馈（个）</span></p>
                  <a><font @click="jump(3)" v-html="groupInfo.abnormalCount"></font></a>
                </div>
              </li>
              <li>
                <div class="box">
                  <p><span class="span8">异形项目数</span></p>
                  <a><font @click="jump(5)" v-html="groupInfo.abnormalRate"></font></a>
                </div>
              </li>
              <li>
                <div class="box">
                  <p><span class="span9">直接材料（%）</span></p>
                  <a :href ="'#/project/project'" ><font v-html="groupInfo.meterial"></font></a>
                </div>
              </li>
              <li>
                <div class="box">
                  <p><span class="span10">合规点检（条）</span></p>
                  <a><font @click="jumpToCheck" v-html="groupInfo.checkCount"></font></a>
                </div>
              </li>
            </ul>
            <div class="clear"></div>
          </div>
        </div>
        <div class="index_core index_box">
          <div class="adm">
            <div class="left">
              <div class="img">
                <img src="../../assets/home/img/img3.jpg" />
              </div>
              <div class="text">
                <h3>{{userName}}</h3>
                <p>欢迎您来到远大住工后台管理平台</p>
              </div>
              <div class="clear"></div>
            </div>
            <div class="list">
              <ul>
                <li>
                  <span class="span1"></span>
                  <div class="text">
                    <p>我的任务数</p>
                    <a><font v-on:click="table1">{{this.total}}</font></a>
                  </div>
                </li>
                <li>
                  <span class="span2"></span>
                  <div class="text">
                    <p>待办流程数</p>
                    <a><font v-on:click="table2">{{this.waitFlowTotal}}</font></a>
                  </div>
                </li>
                <li>
                  <span class="span3"></span>
                  <div class="text">
                    <p>已办流程数</p>
                    <a><font v-on:click="table3">{{this.doneFlowTotal}}</font></a>
                  </div>
                </li>
                <li>
                  <span class="span4"></span>
                  <div class="text">
                    <p>我的提醒数</p>
                    <a><font v-on:click="table4">{{this.total2}}</font></a>
                  </div>
                </li>
              </ul>
              <div class="clear"></div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="adm_nav">
            <ul>
              <li><span id="column1" v-on:click="this.table1" class="span1">我的任务</span></li>
              <li><span id="column2" v-on:click="this.table2" class="span2">待办流程</span></li>
              <li><span id="column3" v-on:click="this.table3" class="span3">已办流程</span></li>
              <li><span id="column4" v-on:click="this.table4" class="span4">我的提醒</span></li>
            </ul>
            <div class="clear"></div>
          </div>
        </div>
        <div class="adm_tab index_box">

          <div class="adm_tab index_box" id="divTable1">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <th>对象名称</th>
                <th>工作任务</th>
                <th>项目阶段</th>
                <th>任务时间</th>
                <th>受理状态</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in this.tableData" :key="item.id">
                <td>{{item.projectName}}</td>
                <td>{{item.missionContent}}</td>
                <td>{{item.stage}}</td>
                <td>{{item.createTime | dateFormatTime}}</td>
                <td>
                  <div v-if ="item.isProxyed == '1'">已受理</div>
                  <div v-else-if ="item.isProxyed == '0'">已推送受理</div>
                  <div v-else>未受理</div>
                </td>
                <td>
                  <!--既没有推送受理0，也没有受理1-->
                  <Button v-if="item.isProxyed != '0' && item.isProxyed != '1'" style="width: 4rem" v-on:click="disposeMission(item)">异常处理</Button>
                  <!--已受理-->
                  <Button v-if="item.isProxyed == '1'" style="width: 4rem" v-on:click="dutyOpposition(item)">责任异议</Button>
                  <!--推送受理-->
                  <Button v-if="item.isProxyed == '0'" style="width: 4rem" :disabled="true">已处理</Button>
                </td>
              </tr>
            </table>
            <div id="page1">&nbsp;&nbsp;<Page :total='total' :page-size='size1' :current='current' @on-change='changePage' @on-page-size-change='changePageSize' show-total /></div>
          </div>


          <div class="adm_tab index_box" id="divTable2" style="display: none">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <th>对象名称</th>
                <th>审批类型</th>
                <th>提交人</th>
                <th>审批说明</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in this.waitFlowTableData" :key="item.id">
                <!--<td>{{item.objName}}</td>-->
                <td>
                  <div v-if ="item.type == '1'"><a  :href ="'#/project/projectInfo?id='+(item.objId)" >{{item.objName}}</a></div>
                  <div v-else-if="item.type == '2'"><a  :href ="'#/account/accountInfo?id='+(item.objId)" >{{item.objName}}</a></div>
                  <div v-else-if="item.type == '3'"><a  :href ="'#/project/designContractInfo?id='+(item.objId)" >{{item.objName}}</a></div>
                  <div v-else-if ="item.type == '4'"><a  :href ="'#/project/projectInfo?id='+(item.projectId)" >{{item.objName}}</a></div>
                </td>
                <td>
                  <div v-if ="item.flowType == '1'">立项审批</div>
                  <div v-else-if="item.flowType == '2'">直接材料费审批</div>
                  <div v-else-if="item.flowType == '3'">报价清单审批</div>
                  <div v-else-if="item.flowType == '4'">中标通知书审批</div>
                  <div v-else-if="item.flowType == '5'">合同评审流程</div>
                  <div v-else-if="item.flowType == '6'">合同复核流程</div>
                  <div v-else-if="item.flowType == '7'">设计合同评审审批</div>
                  <div v-else-if="item.flowType == '8'">项目预成交审批</div>
                  <div v-else-if="item.flowType == '9'">项目销项审批</div>
                  <div v-else-if="item.flowType == '10'">项目方案审批</div>
                  <div v-else-if="item.flowType == '16'">用户申请审批</div>
                  <div v-else-if="item.flowType == '17'">目标调整审批</div>
                  <div v-else-if="item.flowType == '18'">架构调整审批</div>
                  <div v-else-if="item.flowType == '19'">领用审批</div>
                  <div v-else-if="item.flowType == '21'">设计合同评审审批</div>
                  <div v-else-if="item.flowType == '22'">设计合同签订审批</div>
                  <div v-else>其他</div>
                </td>
                <td>{{item.originatorName}}</td>
                <td>{{item.typeDescription}}</td>
                <td>{{item.createTime | dateFormatTime}}</td>
                <td><Button style="width: 3rem" v-on:click="singelApproval(item)">审批</Button></td>
              </tr>
            </table>
            <div id="page2">&nbsp;&nbsp;<Page :total="waitFlowTotal" :page-size="waitFlowSize" :current="waitFlowCurrent" @on-change="waitFlowChangePage" @on-page-size-change="changePageSize"  show-total /></div>
          </div>
          <div class="adm_tab index_box" id="divTable3" style="display: none">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <th>对象名称</th>
                <th>提交人</th>
                <th>审批类型</th>
                <th>审批说明</th>
                <th>创建时间</th>
                <th>详情</th>
              </tr>
              <tr v-for="item in this.doneFlowTableData" :key="item.id">
                <!--<td>{{item.objName}}</td>-->
                <td>
                  <div v-if ="item.type == '1'"><a  :href ="'#/project/projectInfo?id='+(item.objId)" >{{item.objName}}</a></div>
                  <div v-else-if="item.type == '2'"><a  :href ="'#/account/accountInfo?id='+(item.objId)" >{{item.objName}}</a></div>
                  <div v-else-if="item.type == '3'"><a  :href ="'#/project/designContractInfo?id='+(item.objId)" >{{item.objName}}</a></div>
                  <div v-else-if ="item.type == '4'"><a  :href ="'#/project/projectInfo?id='+(item.projectId)" >{{item.objName}}</a></div>
                </td>
                <td>{{item.originatorName}}</td>
                <td>
                  <div v-if ="item.flowType == '1'">立项审批</div>
                  <div v-else-if="item.flowType == '2'">直接材料费审批</div>
                  <div v-else-if="item.flowType == '3'">报价清单审批</div>
                  <div v-else-if="item.flowType == '4'">中标通知书审批</div>
                  <div v-else-if="item.flowType == '5'">合同评审流程</div>
                  <div v-else-if="item.flowType == '6'">合同复核流程</div>
                  <div v-else-if="item.flowType == '7'">设计合同评审审批</div>
                  <div v-else-if="item.flowType == '8'">项目预成交审批</div>
                  <div v-else-if="item.flowType == '9'">项目销项审批</div>
                  <div v-else-if="item.flowType == '10'">项目方案审批</div>
                  <div v-else-if="item.flowType == '16'">用户申请审批</div>
                  <div v-else-if="item.flowType == '17'">目标调整审批</div>
                  <div v-else-if="item.flowType == '18'">架构调整审批</div>
                  <div v-else-if="item.flowType == '19'">领用审批</div>
                  <div v-else-if="item.flowType == '21'">设计合同评审审批</div>
                  <div v-else-if="item.flowType == '22'">设计合同签订审批</div>
                  <div v-else>其他</div>
                </td>
                <td>{{item.typeDescription}}</td>
                <td>{{item.createTime | dateFormatTime}}</td>
                <td><Button style="width: 3rem" v-on:click="jumpToDetail(item.approvalCode)">详情</Button></td>
              </tr>
            </table>
            <div id="page3">&nbsp;&nbsp;<Page :total="doneFlowTotal" :page-size="doneFlowSize" :current="doneFlowCurrent" @on-change="doneFlowChangePage" @on-page-size-change="changePageSize"  show-total /></div>
          </div>

          <div class="adm_tab index_box" style="display: none" id="divTable4">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <th>提醒类型</th>
                <th>提醒内容</th>
                <th>项目名称</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in this.createdMissionTableData" :key="item.id">
                <td>{{item.missionType}}</td>
                <td>{{item.missionContent}}</td>
                <td>{{item.projectName}}</td>
                <td>
                  <span v-if="'2'!= item.missionStatus">进行中</span>
                  <span v-if="'2'== item.missionStatus">已完成</span>
                </td>
                <td>{{item.createTime | dateFormatTime}}</td>
                <td>
                  <div v-if="item.missionType == '异常反馈'">
                    <Button v-if="'0'== item.isProxyed || null == item.isProxyed" @click="dividedMission(item)" style="width: 3rem">异常划分</Button>
                  </div>
                  <div v-if="item.missionType == '异常异议'">
                    <Button v-if="'1'!= item.isProxyed" @click="dividedDuty(item)" style="width: 3rem">责任划分</Button>
                  </div>
                </td>
              </tr>
            </table>
            <div id="page4">&nbsp;&nbsp;<Page :total="total2" :page-size="size2" :current="current2" @on-change="changePage2" @on-page-size-change="changePageSize" show-total /></div>
          </div>
        </div>
        </div>

        <div class="page_right">
          <div class="index_kpi index_box" style="display: none;margin-bottom: 15px;">
            <div class="index_tit">
              <h3><em style="color: black">本月KPI得分</em></h3>
            </div>
            <div class="cont">
              <div class="text">
                <p>排名前10%</p>
              </div>
              <div class="img">
                <img src="../../assets/home/img/img4.png" />
              </div>
              <div class="clear"></div>
            </div>
          </div>
          <div class="index_ptgg index_box">
            <div class="index_tit">
              <h3><em style="color: black">平台公告</em></h3>
            </div>
            <div class="cont" style="height:260px">
              <div class="tit">
                <!--放两个同步的跑马灯,效果更好-->
                <Carousel v-model="setting.value" :autoplay="setting.autoplay" :autoplay-speed="setting.autoplaySpeed"
                          :dots="setting.dots" :radius-dot="setting.radiusDot" :trigger="setting.trigger" :arrow="setting.arrow">
                  <CarouselItem>
                    <p>最近公告<span style="">{{noticeCreateTime | dateFormat}}</span></p>
                  </CarouselItem>
                  <CarouselItem>
                    <p>最近公告<span style="">{{noticeCreateTime2 | dateFormat}}</span></p>
                  </CarouselItem>
                </Carousel>
              </div>
              <div class="text">
                <Carousel v-model="setting.value" :autoplay="setting.autoplay" :autoplay-speed="setting.autoplaySpeed"
                          :dots="setting.dots" :radius-dot="setting.radiusDot" :trigger="setting.trigger" :arrow="setting.arrow">
                  <CarouselItem>
                    <div class="demo-carousel"><p style="margin-bottom: 10px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{info0}}</p></div>
                  </CarouselItem>
                  <CarouselItem>
                    <div class="demo-carousel"><p style="margin-bottom: 10px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{info1}}</p></div>
                  </CarouselItem>
                </Carousel>
                <a style="width:96px;float: right" v-on:click="this.jumpToHistoryNotice"><div style="margin-right: 2rem;display:inline-block;width: 96px;height: 26px;line-height: 26px;border: 1px solid #c8cfd8;text-align: center;font-size: 13px;border-radius: 2px;color:black">
                  查看历史公告</div></a>
              </div>
            </div>
          </div>
          <div v-show="$isAuth('home:ranking')" class="index_phb index_box">
            <div class="index_tit">
              <h3><em style="color: black">排行榜</em></h3>
              <div class="phb_sel">
                <select id="choosedQuarter" v-on:change="changeRank2()">
                  <option v-for="item in this.allQuarters" value="" :key="item.id">{{item}}</option>
                </select>
                <select id="rankChange" v-on:change="changeRank()">
                  <option value="0">业绩-个人榜</option>
                  <option value="1">业绩-项目组</option>
                  <option value="2" selected>业绩-团队榜</option>
                  <option value="3">质量-个人榜</option>
                  <option value="4">质量-项目组</option>
                  <option value="5">质量-团队榜</option>
                </select>
              </div>
            </div>
            <div id="rank1" class="phb_tab">
              <table cellpadding="0" cellspacing="0" id="rankList">
                <tr v-for="item in this.allSalesData" :key="item.id">
                  <td v-if="item.rank == '1'"><p><span class='span1'>1</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '2'"><p><span class='span2'>2</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '3'"><p><span class='span3'>3</span><i class='i1'></i></p></td>
                  <td v-else><p><span>{{item.rank}}</span><i class='i2'></i></p></td>
                  <td>{{item.ownerName}}</td>
                  <td>{{item.depName}}</td>
                  <td>{{item.amount}}</td>
                </tr>
              </table>
            </div>

            <div id="rank2" class="phb_tab">
              <table cellpadding="0" cellspacing="0">
                <tr v-for="item in this.groupSalesData" :key="item.id">
                  <td v-if="item.rank == '1'"><p><span class='span1'>1</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '2'"><p><span class='span2'>2</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '3'"><p><span class='span3'>3</span><i class='i1'></i></p></td>
                  <td v-else><p><span>{{item.rank}}</span><i class='i2'></i></p></td>
                  <td>{{item.depName}}</td>
                  <td>{{item.ownerName}}</td>
                  <td>{{item.amount}}</td>
                </tr>
              </table>
            </div>

            <div id="rank3" class="phb_tab">
              <table cellpadding="0" cellspacing="0">
                <tr v-for="item in this.teamSalesData" :key="item.id">
                  <td v-if="item.rank == '1'"><p><span class='span1'>1</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '2'"><p><span class='span2'>2</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '3'"><p><span class='span3'>3</span><i class='i1'></i></p></td>
                  <td v-else><p><span>{{item.rank}}</span><i class='i2'></i></p></td>
                  <td>{{item.depName}}</td>
                  <td>{{item.ownerName}}</td>
                  <td>{{item.amount}}</td>
                </tr>
              </table>
            </div>

            <div id="rank4" class="phb_tab">
              <table cellpadding="0" cellspacing="0">
                <tr v-for="item in this.quanityData1" :key="item.id">
                  <td v-if="item.rank == '1'"><p><span class='span1'>1</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '2'"><p><span class='span2'>2</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '3'"><p><span class='span3'>3</span><i class='i1'></i></p></td>
                  <td v-else><p><span>{{item.rank}}</span><i class='i2'></i></p></td>
                  <td>{{item.depName}}</td>
                  <td>{{item.ownerName}}</td>
                  <td>{{item.score}}</td>
                </tr>
              </table>
            </div>

            <div id="rank5" class="phb_tab">
              <table cellpadding="0" cellspacing="0">
                <tr v-for="item in this.quanityData2" :key="item.id">
                  <td v-if="item.rank == '1'"><p><span class='span1'>1</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '2'"><p><span class='span2'>2</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '3'"><p><span class='span3'>3</span><i class='i1'></i></p></td>
                  <td v-else><p><span>{{item.rank}}</span><i class='i2'></i></p></td>
                  <td>{{item.depName}}</td>
                  <td>{{item.ownerName}}</td>
                  <td>{{item.score}}</td>
                </tr>
              </table>
            </div>

            <div id="rank6" class="phb_tab">
              <table cellpadding="0" cellspacing="0">
                <tr v-for="item in this.quanityData3" :key="item.id">
                  <td v-if="item.rank == '1'"><p><span class='span1'>1</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '2'"><p><span class='span2'>2</span><i class='i1'></i></p></td>
                  <td v-else-if="item.rank == '3'"><p><span class='span3'>3</span><i class='i1'></i></p></td>
                  <td v-else><p><span>{{item.rank}}</span><i class='i2'></i></p></td>
                  <td>{{item.depName}}</td>
                  <td>{{item.ownerName}}</td>
                  <td>{{item.score}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    <!--弹出窗口一，流程审批-->
    <Modal v-model="waitFlowChooseFlag" title="流程审批" >
      <Table stripe :columns="columnsChoosedFlow" :data="waitFlowChoosedTableData">
        <template slot-scope="scope"  slot="proSlot">
          {{scope.row.objName}}
        </template>
        <template slot-scope="scope"  slot="timeSlot">
          {{scope.row.joinTime | dateFormatTime}}
        </template>
      </Table>
      <br>
      <div><em style="color: #FF0000">*&nbsp;</em>请输入审批意见：</div>
      <div><Input placeholder="请输入审批意见" v-model="approvalComments" style="width:260px;margin-top: 10px" type="textarea"/></div>
      <br><br>
      <div slot="footer">
        <Button style="background-color:rgb(10,96,154);width: 7rem; color: white; margin-left: 5px;" size="large" @click="approvale('top')">驳回至创建人</Button>
        <Button style="background-color:rgb(10,96,154);width: 7rem;color: white; margin-left: 5px;" size="large" @click="approvale('up')">驳回至上一级</Button>
        <Button style="background-color:rgb(10,96,154);width: 7rem;color: white; margin-left: 5px;" size="large" @click="approvale('')">审批通过</Button>
      </div>
    </Modal>


    <!--弹出窗口二，我的任务栏目点击处理异常-->
    <Modal v-model="newMissionFlag" title="异常受理" >
      <Row>
        <br><br>
        <Col span="6" style="text-align: center;line-height: 300%">异常内容：</Col>
        <Col span="12"><Input type="textarea" v-model="this.choosedContent" :disabled=true></Input></Col>
      </Row>
      <Row>
        <br><br>
        <Col span="6" style="text-align: center;line-height: 200%">是否受理：</Col>
        <Col span="12">
          <Select :transfer="true" v-model="isAccept" clearable filterable>
            <Option v-for="item in acceptResults" :value="item.value" :key="item.value">{{ item.name}}</Option>
          </Select>
        </Col>
      </Row>
      <Row v-if="isAccept == '0'">
        <br><br>
        <Col span="6" style="text-align: center;line-height: 300%"><em style="color: red">*</em>&nbsp;&nbsp;推送原因：</Col>
        <Col span="12"><Input v-model="proxyReason" type="textarea" placeholder="原因说明"></Input></Col>
      </Row>
      <Row  class="file">
        <br><br>
        <Col span="6" style="text-align: center;line-height: 300%">异常附件：</Col>
        <Col span="12">
          <Col v-for="(item,index) in fileData" :value="item.id" :key="item.id" >
            <a @click="downloadAttachement(item)">{{item.name}}</a>
          </Col>
        </Col>

      </Row>
      <Row v-if="isAccept == '0'">
        <br><br>
        <Col span="6" style="text-align: center;line-height: 300%">附件补充：</Col>
        <Col span="12">
        <Upload ref="" action="http" :before-upload ="handleUpload" multiple show-upload-list>
          <Button icon="ios-cloud-upload-outline">上传文件</Button>
        </Upload>
            <Col   v-for="(item,index) in fileData2" :value="item.id" :key="item.id" >
              <!--<a :href="item.url" :download="item.name" target="view_window">{{item.name}}</a>-->
              <a @click="downloadAttachement(item)">{{item.name}}</a>
              <Icon style="margin-left: 1px" type="md-close"  @click="removeFile(index)"/>
            </Col>
        </Col>
      </Row>
      <br><br>
      <div slot="footer">
        <Button style="background-color:rgb(10,96,154);width: 7rem;color: white; margin-left: 5px;" size="large" @click="acceptMissionOperate">确定</Button>
      </div>
    </Modal>

    <!--弹出窗口三，副总我的提醒栏目点击提醒操作，分配异常处理部门-->
    <Modal v-model="abnormalDivideFlag" title="异常划分" >
      <Form ref="abnormalDivide" :model="abnormalDivide" :label-width="160" inline label-position="right">
        <FormItem label="异常内容：" prop="missionContent">
          <Input v-model="abnormalDivide.missionContent" type="textarea" :rows="3" :disabled="true"></Input>
        </FormItem>
        <FormItem label="反馈部门：" prop="nowFactoryDep">
          <Input v-model="abnormalDivide.nowFactoryDep" :disabled="true"/>
        </FormItem>
        <FormItem label="推送原因：" prop="proxyedReason">
          <Input v-model="abnormalDivide.proxyedReason" type="textarea" :rows="3" :disabled="true" />
        </FormItem>
        <FormItem label="受理部门：" prop="factoryDep">
          <Select v-model.trim="abnormalDivide.department" placeholder="请选择受理部门" filterable>
            <Option v-for="item in factoryDeps" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <br/><br/>
          <Row>
            <Col span="8" style="text-align: right;padding-right: 13px">附件信息：</Col>
            <Col span="12" style="text-align: left">
              <Col v-for="(item,index) in fileData3" :value="item.id" :key="item.id" >
                <a @click="downloadAttachement(item)">{{item.name}}</a>
              </Col>
          </Col>
          </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="abnormalDivideComfirm">确定</Button>
      </div>
    </Modal>

    <!--弹出窗口四，异常责任划分-->
    <Modal v-model="abnormalDutyFlag" title="责任划分" >
      <Form ref="abnormalDuty" :model="abnormalDuty" :label-width="160" inline label-position="right">
        <FormItem label="异常内容：" prop="missionContent">
          <Input v-model="abnormalDuty.missionContent" type="textarea" :rows="3" :disabled="true"></Input>
        </FormItem>
        <FormItem label="反馈部门：" prop="remark">
          <Input v-model="abnormalDuty.nowFactoryDep" :disabled="true"/>
        </FormItem>
        <FormItem v-if="null != abnormalDuty.proxyedReason" label="异议内容：" prop="proxyedReason">
          <Input v-model="abnormalDuty.proxyedReason" type="textarea" :rows="3" :disabled="true" />
        </FormItem>
        <FormItem v-if="null != abnormalDuty.remark" label="申请责任部门：" prop="remark">
          <Input v-model="abnormalDuty.remark" :disabled="true" />
        </FormItem>
        <FormItem label="划分责任部门：" prop="factoryDep">
          <Select v-if="abnormalDuty.title == '副总'" v-model.trim="abnormalDuty.department" placeholder="请选择责任部门" filterable>
            <Option v-for="item in factoryDeps3" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
          <Select v-else v-model.trim="abnormalDuty.department" placeholder="请选择责任部门" filterable>
            <Option v-for="item in factoryDeps2" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <br/><br/>
        <!--<Row>-->
          <!--<Col span="8" style="text-align: right;padding-right: 13px">附件信息：</Col>-->
          <!--<Col span="12" style="text-align: left">-->
            <!--<Col v-for="(item,index) in fileData4" :value="item.id" :key="item.id" >-->
              <!--<a @click="downloadAttachement(item)">{{item.name}}</a>-->
            <!--</Col>-->
          <!--</Col>-->
        <!--</Row>-->
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="dividedDutyConfirm">确定</Button>
      </div>
    </Modal>
    <!-- 责任异议 -->
    <Modal v-model="dutyOppositonFlag" title="责任异议" width="30%">
      <Row>
        <br><br>
        <Col span="6" style="text-align: center;line-height: 300%">异常内容：</Col>
        <Col span="12">
          <Input v-model="choosedOppositionMission.missionContent" readonly="readonly"></Input>
        </Col>
      </Row>
      <Row>
        <br><br>
        <Col span="6" style="text-align: center;line-height: 300%">创建时间：</Col>
        <Col span="12">
          <Input v-model="choosedOppositionMission.createTime" readonly="readonly"></Input>
        </Col>
      </Row>
      <Row>
        <br><br>
        <Col span="6" style="text-align: center;line-height: 300%"><em style="color: #FF0000">*&nbsp;</em>申请责任部门：</Col>
        <Col span="12">
          <Select v-model.trim="choosedOppositionMission.blameDep" placeholder="请选择责任部门" filterable>
            <Option v-for="item in acceptObjects" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <br><br>
        <Col span="6" style="text-align: center;line-height: 300%"><em style="color: #FF0000">*&nbsp;</em>异议说明：</Col>
        <Col span="12">
          <Input type="textarea" v-model="choosedOppositionMission.oppositionDescription"></Input>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large" @click="dutyOppositionConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {acceptMissionInfo,queryAllProjects,queryCreatedMissionPage,queryGroupRankInfo,queryMissionPage,queryNoticeInfo,querySalesRankInfo,queryStatisticsInfo,queryTeamRankInfo,queryEchartsData,queryScoreRankInfo,queryGroupScoreRankInfo,queryTeamScoreRankInfo, queryOperatorRankInfo, dividedMission, dividedDuty} from "../../api/behavior/project";
  import {queryUserList} from "../../api/system/user";
  import {batchApproval, batchReject, queryDoneFlowPage, queryWaitFlowPage} from "../../api/behavior/approval";
  import moment from "moment";
  import {getAllCompanys, getQuatersOfLatestThreeYear} from "../../api/behavior/statistics";
  import axios from 'axios';
  import {dutyOppositionSubmit} from "../../api/behavior/projectNext";

  export default {
    name: "home",
    data() {
      return {
        choosedAbnormity:{},
        choosedOppositionMission:{},
        abnormalDutyFlag:false,
        abnormalDuty:{},
        //我的处理异常任务中原有的文件
        fileData:[],
        //我的处理异常任务中新增的文件
        fileData2:[],
        //副总在我的提醒栏目看到的异常
        fileData3:[],
        abnormalDivide:{},
        choosedAbnormityId:'',
        isAccept:'1',
        isAllCompanyFlag:true,
        operatorQuanityRank:'',
        operatorAmountRank:'',
        joinTime:'',
        interval:{},//排行榜启停触发器
        timeRange:null,
        tableHeight:300,
        animate:true,
        salesData:[],
        allSalesData:[],
        allQuarters:[],
        choosedQuarter:'',
        groupSalesData:[],
        teamSalesData:[],
        quanityData1:[],
        quanityData2:[],
        quanityData3:[],
        rankType: '0',
        rankList: [
          {
            value: '0',
            label: '销售榜'
          },
          {
            value: '1',
            label: '项目组榜'
          },
          {
            value: '2',
            label: '团队榜'
          },
        ],
        acceptResults: [
          {
            name: '确认受理',
            value : '1',
            align:'center',
          },
          {
            name: '推送受理',
            value : '0',
            align:'center',
          }
        ],

        echartsData:[],//图表数据集合
        echartsDataX:new Array(),//图表数据集合X轴
        echartsDataY:new Array(),//图表数据集合Y轴
        addModal : false,
        groupInfo :{},
        tittle:'',
        amountData:[],
        //被选中的委托任务
        missionChooseIds:'',
        //被选中的待办流程id
        waitFlowChooseIds:'',
        //被选中的已办流程
        doneFlowChooseData:[],
        //我创建的任务中被选中的任务id
        createdMissionChooseIds:'',
        //任务委托人
        missionProxyMan:'',
        //是否弹窗展示任务委托人
        missionChooseFlag :false,
        //选择的人员列表
        missionUserData:[],
        //委托原因
        proxyReason:'',
        createMissionTableData:'',
        newMissionFlag:false,
        choosedContent:'',
        missionProjects:[],
        missionProject:'',
        assignedMan:'',
        missionMan:'',
        missionContent:'',
        missionReason:'',
        //待办流程
        waitFlowChooseFlag :false,
        // abnormalDivide:{},
        abnormalDivideFlag:false,
        factoryDeps:[
          {
            name:'客户部',
            value:'客户部',
          },
          {
            name:'技术中心',
            value:'技术中心',
          },
          {
            name:'推送工厂',
            value:'推送工厂',
          },
        ],
        factoryDeps2:[
          {
            name:'客户部',
            value:'客户部',
          },
          {
            name:'技术中心',
            value:'技术中心',
          },
          {
            name:'BPL',
            value:'BPL',
          },
          {
            name:'IED',
            value:'IED',
          },
          {
            name:'非我方责任部门',
            value:'非我方责任部门',
          }
        ],
        factoryDeps3:[
          {
            name:'客户部',
            value:'客户部',
          },{
            name:'技术中心',
            value:'技术中心',
          }],

        //选中的待办任务信息
        columnsChoosedFlow:[
          {
            title: '项目名称',
            slot:'proSlot'
          },
          {
            title:'提交人',
            key:'originatorName'
          },
          {
            title:'审批类型',
            key:'typeDescription'
          },
          {
            title:'创建时间',
            slot:'timeSlot',
            align:'center',
          }
        ],
        waitFlowChoosedTableData:[],
        //审批意见
        approvalComments:'',
        //我的任务的分页信息
        tableData:[],
        total:0,
        size1:5,
        current:1,
        //任务委派的分页信息
        createdMissionTableData:[],
        total2:0,
        size2:5,
        current2:1,
        //待办流程的分页信息
        waitFlowTableData:[],
        waitFlowTotal:0,
        waitFlowSize:5,
        waitFlowCurrent:1,
        //已办流程的分页信息
        doneFlowTableData:[],
        doneFlowTotal:0,
        doneFlowSize:5,
        doneFlowCurrent:1,
        ids:'',
        noticeInfo:[],
        noticeCreateTime:'',
        noticeCreateTime2:'',
        infoIndex :1,
        //通知信息移动参数
        setting: {
          value:0,
          autoplay: true,
          autoplaySpeed: 8000,
          dots: 'none',
          radiusDot: false,
          trigger: 'click',
          arrow: 'never'
        },
        info0:'暂无通知',
        info1:'',
        info2:'',
        companys:[],
        echartsDataTypes:[
          { name:"签约额",
            id :"1"
          },
          { name:"PC量",
            id :"2"
          },
          { name:"项目质量得分",
            id :"3"
          },
        ],
        changeType:'1',
        companyId:'',
        choosedProjectName:'',
        /*全国排行榜榜单类型*/
        ranktype:0,
        label1: (h) => {
          return h('div', [
            h('Icon', {props:{type: 'ios-book'}}),
            h('span', '我的任务'),
            h('Badge', {props:{count: this.total}})
          ])
        },
        label2: (h) => {
          return h('div', [
            h('Icon', {props:{type: 'md-git-compare'}}),
            h('span', '待办流程'),
            h('Badge', {props:{count: this.waitFlowTotal}})
          ])
        },
        label3: (h) => {
          return h('div', [
            h('Icon', {props:{type: 'md-git-network'}}),
            h('span', '已办流程'),
            /*h('Badge', {props:{count: this.doneFlowTotal}})*/
          ])
        },
        label4: (h) => {
          return h('div', [
            h('Icon', {props:{type: 'md-notifications'}}),
            h('span', '我的提醒'),
            h('Badge', {props:{count: this.total2}})
          ])
        },
        gap:'3',
        dutyOppositonFlag:false,
        acceptObjects:[
          {
            name: 'IED',
            value: 'IED'
          },
          {
            name: 'BPL',
            value: 'BPL'
          },
          {
            name: '技术中心',
            value: '技术中心'
          },
          {
            name: '客户部',
            value: '客户部',
          },
        ],
      }
    },
    computed: {
      userName(){
        var name = this.$store.getters.userName;
        return name;
      }

    },
    methods: {
      //点击关键指标跳转
      jump(type) {
        this.$router.push({name: 'showProject', query: {'type': type}});
      },
      //跳转到点检信息界面
      jumpToCheck() {
        this.$router.push({name: 'myCheck'});
      },
      //跳转到历史公告界面
      jumpToHistoryNotice() {
        this.$router.push({name: 'myNotice'});
      },
      //根据时间段查询岗位关键信息的统计信息
      queryGroupInfoByTimeRange(){
        this.queryGroupInfo(this.timeRange);
      },
      queryGroupInfoByTimeRange2(){
        this.queryGroupInfo("");
      },
      //查询岗位关键信息的统计信息
      queryGroupInfo(timeRange) {
        /*let companyId2 = document.getElementById("companyId2").value;*/
        queryStatisticsInfo(timeRange).then(res => {
          this.groupInfo = res.data;
        });
      },
      //任务列表翻页
      changePage(num) {
        this.$Spin.show();
        queryMissionPage(num, this.size1).then(res => {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.size1 = res.data.size;
          this.current = res.data.current;
          this.$Spin.hide();
          this.table1();
        })

      },
      //待办流程翻页
      waitFlowChangePage(num) {
        this.$Spin.show();
        queryWaitFlowPage(num, this.waitFlowSize).then(res => {
          if (null != res) {
            this.waitFlowTableData = res.records;
            this.waitFlowTotal = res.total;
            this.waitFlowSize = res.size;
            this.waitFlowCurrent = res.current;
            this.$Spin.hide();
            this.table2();
          }
        })
      },
      //已办流程翻页
      doneFlowChangePage(num) {
        this.$Spin.show();
        queryDoneFlowPage(num, this.doneFlowSize).then(res => {
          if (null != res) {
            this.doneFlowTableData = res.data.records;
            this.doneFlowTotal = res.data.total;
            this.doneFlowSize = res.data.size;
            this.doneFlowCurrent = res.data.current;
            this.$Spin.hide();
            this.table3();
          }
        })
      },

      //新建任务列表翻页
      changePage2(num) {
        this.$Spin.show();
        queryCreatedMissionPage(num, this.size1).then(res => {
          this.createdMissionTableData = res.data.records;
          this.total2 = res.data.total;
          this.size2 = res.data.size;
          this.current2 = res.data.current;
          this.$Spin.hide();
          this.table4();
        })

      },
      changePageSize(size) {
      },
      //初始化分页查询任务信息
      queryMissionPage(pageNum, pageSize) {
        this.$Spin.show();
        queryMissionPage(pageNum, pageSize).then(res => {
          if (null != res) {
            this.tableData = res.data.records;
            this.total = res.data.total;
            this.size1 = res.data.size;
            this.current = res.data.current;
            if (this.tableData.id != null || this.tableData.id != '') {
              this.$Spin.hide();
            }
          }
        })
      },
      //查询用户创建的任务信息
      queryCreatedMission(pageNum, pageSize) {
        this.$Spin.show();
        queryCreatedMissionPage(pageNum, pageSize).then(res => {
          if (null != res) {
            this.createdMissionTableData = res.data.records;
            this.total2 = res.data.total;
            this.size2 = res.data.size;
            this.current2 = res.data.current;
          }
          this.$Spin.hide();
        })
      },
      //初始化分页查询待办流程信息
      queryWaitFlowPage(pageNum, pageSize) {
        this.$Spin.show();
        queryWaitFlowPage(pageNum, pageSize).then(res => {
          if (null != res) {
            this.waitFlowTableData = res.records;
            this.waitFlowTotal = res.total;
            this.waitFlowSize = res.size;
            this.waitFlowCurrent = res.current;
            if (this.waitFlowTableData.id != null || this.waitFlowTableData.id != '') {
              this.$Spin.hide();
            }
          }
        })
      },
      //初始化分页查询已办流程信息
      queryDoneFlowPage(pageNum, pageSize) {
        this.$Spin.show();
        queryDoneFlowPage(pageNum, pageSize).then(res => {
          if (null != res && null != res.data) {
            this.doneFlowTableData = res.data.records;
            this.doneFlowTotal = res.data.total;
            this.doneFlowSize = res.data.size;
            this.doneFlowCurrent = res.data.current;
            this.$Spin.hide();
          }
        })
      },

      table1(){
        this.queryMissionPage(this.current,this.size1);
        document.getElementById("divTable1").style.display = "block";
        document.getElementById("divTable2").style.display = "none";
        document.getElementById("divTable3").style.display = "none";
        document.getElementById("divTable4").style.display = "none";
        document.getElementById("column1").style.color = "#00437c";
        document.getElementById("column2").style.color = "#a1b8c8";
        document.getElementById("column3").style.color = "#a1b8c8";
        document.getElementById("column4").style.color = "#a1b8c8";
      },
      table2(){
        this.queryWaitFlowPage(this.waitFlowCurrent,this.waitFlowSize);
        document.getElementById("divTable2").style.display = "block";
        document.getElementById("divTable1").style.display = "none";
        document.getElementById("divTable3").style.display = "none";
        document.getElementById("divTable4").style.display = "none";
        document.getElementById("column2").style.color = "#00437c";
        document.getElementById("column1").style.color = "#a1b8c8";
        document.getElementById("column3").style.color = "#a1b8c8";
        document.getElementById("column4").style.color = "#a1b8c8";
      },
      table3(){
        this.queryDoneFlowPage(this.doneFlowCurrent,this.doneFlowSize);
        document.getElementById("divTable3").style.display = "block";
        document.getElementById("divTable2").style.display = "none";
        document.getElementById("divTable1").style.display = "none";
        document.getElementById("divTable4").style.display = "none";
        document.getElementById("column3").style.color = "#00437c";
        document.getElementById("column2").style.color = "#a1b8c8";
        document.getElementById("column1").style.color = "#a1b8c8";
        document.getElementById("column4").style.color = "#a1b8c8";
      },
      table4(){
        this.queryCreatedMission(this.current2,this.size2);
        document.getElementById("divTable4").style.display = "block";
        document.getElementById("divTable2").style.display = "none";
        document.getElementById("divTable3").style.display = "none";
        document.getElementById("divTable1").style.display = "none";
        document.getElementById("column4").style.color = "#00437c";
        document.getElementById("column2").style.color = "#a1b8c8";
        document.getElementById("column3").style.color = "#a1b8c8";
        document.getElementById("column1").style.color = "#a1b8c8";
      },



      /*//重新委托任务,弹出任务委托窗口
      chooseProxy(){
        if('' == this.missionChooseIds){
          this.$Message.warning('请选择需要委托的任务');
          return;
        }
        this.missionProxyMan = '';
        this.proxyReason = '';
        this.missionChooseFlag = true
        //选择人员时初始化下拉选用户列表
        queryUserList().then(res => {
          this.missionUserData = res.data;
        })
      },*/
      //待办流程,弹出审批窗口(通过按钮跳转，暂时未调用)
      approvalFlow(){
        if('' == this.waitFlowChoosedTableData){
          this.$Message.warning('请选择需要审批的流程');
          return;
        }
        this.waitFlowChooseFlag = true;
      },
      //待办流程,弹出审批窗口(原来由按钮调用,先将其加入列表展示）
      singelApproval(row){
        //this.processData = [];
        //this.processData.push(row);
        this.waitFlowChoosedTableData = [];
        this.waitFlowChoosedTableData.push(row);
        this.waitFlowChooseFlag = true;
      },
      //已办流程，跳转至流程详情页面(通过按钮跳转，暂时未调用)
      flowDetail(){
        if(this.doneFlowChooseData.length != 1){
          this.$Message.warning('请选择一条流程信息');
          return;
        }
        let code = this.doneFlowChooseData[0].approvalCode;
        this.$router.push({ name: 'flowDetail',query:{code:code}});
      },
      //跳转到流程详情页面(原来由按钮调用,先将其加入列表展示）
      jumpToDetail(code){
        this.$router.push({name: 'flowDetail', query: {'code': code}});
      },

      //批量审批接口
      approvale(rejectType){
        let data = this.waitFlowChoosedTableData;
        let selectedCode = '';
        for(let i=0;i<data.length;i++){
          selectedCode = selectedCode + data[i].approvalCode+ ',';
        }
        let comments = this.approvalComments;
        if('' == comments){
          this.$Message.warning('请输入审批意见');
          return;
        }


        //传入参数为空则为批量批准
        if('' == rejectType){
          batchApproval(selectedCode,comments).then(res => {
            if(200 == res.code){
              this.$Message.success(res.data);
              this.queryWaitFlowPage(this.waitFlowCurrent,this.waitFlowSize);
            }else{
              this.$Message.error(res.data);
            }
          });
        }
        //返回到上一个审批节点
        else if('up' == rejectType){
          batchReject(selectedCode,comments,rejectType).then(res => {
            if(200 == res.code){
              this.$Message.success(res.data);
              this.queryWaitFlowPage(this.waitFlowCurrent,this.waitFlowSize);
            }else{
              this.$Message.error(res.data);
            }
          });
        }
        //返回到流程创建人
        else if('top' == rejectType){
          batchReject(selectedCode,comments,rejectType).then(res => {
            if(200 == res.code){
              this.$Message.success(res.data);
              this.queryWaitFlowPage(this.waitFlowCurrent,this.waitFlowSize);
            }else{
              this.$Message.error(res.data);
            }
          });
        }
        this.waitFlowChooseFlag = false;
      },
      //提交委托任务信息
      // missionProxy(){
      //   let missionIds = this.missionChooseIds;
      //
      //   let proxyedUser = this.missionProxyMan;
      //
      //   let proxyedReason = this.proxyReason;
      //   if(null == missionIds || null == proxyedUser){
      //     this.$Message.warning('请选择委托任务和委托人员');
      //   }
      //   assignMissionInfo(missionIds,proxyedUser,proxyedReason).then(res => {
      //     if(200 == res.code){
      //       this.$Message.success(res.data);
      //     }else{
      //       this.$Message.error(res.data);
      //     }
      //   });
      // },
      //受理任务操作
      acceptMissionOperate(){
        let missionId = this.choosedAbnormityId;
        //是否受理
        let isProxyed = this.isAccept;
        let proxyedReason = this.proxyReason;
        let projectId = this.id;
        //不受理
        if("0" == isProxyed){
          if(null == proxyedReason || ""== proxyedReason || undefined == proxyedReason){
            this.$Message.warning("请填写不受理原因");
            return;
          }
        }
        acceptMissionInfo(missionId,isProxyed,proxyedReason,projectId,this.fileData2).then(res => {
          if(null != res){
            this.$Message.info(res.data);
          }
          this.table1();
          this.newMissionFlag = false;
        });
      },
      //我的任务列表用户选择的信息
      missionRowChange(currentRow, oldCurrentRow){
        let selections = currentRow;
        let selectedIds = '';
        for(let i=0;i<selections.length;i++){
          selectedIds = selectedIds + selections[i].id+ ',';
        }
        this.missionChooseIds = selectedIds;
      },
      //待办流程用户选择的信息
      approvalFlowRowChange(currentRow){
        this.waitFlowChoosedTableData = currentRow;
      },
      doneFlowRowChange(currentRow){
        this.doneFlowChooseData = currentRow;
      },
      //我创建的任务列表用户选择的信息
      createdMissionRowChange(currentRow, oldCurrentRow){
        let selections = currentRow;
        let selectedIds = '';
        for(let i=0;i<selections.length;i++){
          selectedIds = selectedIds + selections[i].id+ ',';
        }
        this.createdMissionChooseIds = selectedIds;
      },
      //新建任务，任务委派
      showNewMissionModal(){
        this.newMissionFlag = true;
        queryAllProjects().then(res => {
          this.missionProjects = res.data;
        })
        queryUserList().then(res => {
          this.missionUserData = res.data;
        })
      },
      //我的任务栏目点击处理异常提醒信息
      disposeMission(item){
        this.newMissionFlag = true;
        this.choosedContent = item.missionContent;
        this.choosedProjectName = item.projectName;
        this.choosedAbnormityId = item.id;
        this.fileData = item.abnormityAttachments || [];
        this.fileData2 = [];
      },

      //(副总)划分异常所属部门(客户部/技术中心)
      dividedMission(item){
        this.abnormalDivideFlag = true;
        this.abnormalDivide = item;
        this.fileData3 = item.abnormityAttachments || [];
      },

      //提交新建任务信息
      // missionSubmit(){
      //   let missionProject = this.missionProject;
      //   let missionContent = this.missionContent;
      //   let missionMan = this.missionMan;
      //   if(null == missionProject || null == missionMan){
      //     this.$Message.warning('请选择项目名称或者被委派人');
      //   }
      //   if(missionContent == null){
      //     this.$Message.warning('请填写任务内容');
      //   }
      //   saveMission(missionProject,missionContent,missionMan).then(res => {
      //     if(200 == res.code){
      //       this.$Message.success(res.data);
      //       this.queryCreatedMission(this.current2,this.size2);
      //     }else{
      //       this.$Message.error(res.data);
      //     }
      //   });
      // },
      //提交重新委托任务信息(原来由按钮点击调用,现已经改为直接从表中操作)
      // completeMission(){
      //   this.$Spin.show();
      //   let missionIds = this.createdMissionChooseIds;
      //   if(null == missionIds){
      //     this.$Message.warning('请选择任务');
      //   }
      //   completeMission(missionIds).then(res => {
      //     if(200 == res.code){
      //       this.$Message.success(res.data);
      //       this.queryCreatedMission(this.current2,this.size2);
      //       this.$Spin.hide();
      //     }else{
      //       this.$Message.error(res.data);
      //     }
      //   });
      // },
      //提交重新委托任务信息
      // completeMission2(id){
      //   //掉用的是批量接口,即便单个id也要拼上逗号
      //   let missionId = id+',';
      //   this.$Modal.confirm({
      //     title: '确认',
      //     content: '确定完成该任务吗？',
      //     onOk: () => {
      //       this.$Spin.show();
      //       completeMission(missionId).then(res => {
      //         if(200 == res.code){
      //           this.$Message.success(res.data);
      //           this.table1();
      //           this.$Spin.hide();
      //         }else{
      //           this.$Message.error(res.data);
      //         }
      //       }).catch(() =>{
      //         return false;
      //       })
      //     }
      //   });
      //   this.queryCreatedMission(this.current2,this.size2);
      //   this.$Spin.hide();
      // },

      //排行榜信息滚动
      showMarquee() {
        this.animate = true;
        setTimeout(() => {
          if(null != this.allSalesData) {
            if (this.allSalesData.length > 7) {
              this.allSalesData.push(this.allSalesData[0]);
              this.allSalesData.shift();
              this.salesData = [];
              this.salesData = [].concat(this.allSalesData.slice(0, 7));
            } else {
              this.salesData.push(this.salesData[0]);
              this.salesData.shift();
            }
            this.animate = false;
          }
        }, 5000);
      },
      mEnter(){
        clearInterval(this.interval);
      },
      mLeave(){
        this.interval = setInterval(this.showMarquee,5000);
      },

      //获取最新通知消息
      getNoticeInfo(){
        queryNoticeInfo().then(res => {
          if(null != res.data){
            this.noticeInfo = res.data;
            this.noticeCreateTime  = this.noticeInfo[0].createTime;
            this.info0 = this.noticeInfo[0].content;
            if(this.noticeInfo.length >1){
              this.noticeCreateTime2  = this.noticeInfo[1].createTime;
              this.info1 = this.noticeInfo[1].content;
            }
          }

        });
      },
      //获取这个季度销售排名信息
      getSalesRankInfo(){
        querySalesRankInfo(this.choosedQuarter).then(res => {
          let datas = res.data;
          this.allSalesData = datas;
          document.getElementById("rank1").style.display = "block";
          document.getElementById("rank2").style.display = "none";
          document.getElementById("rank3").style.display = "none";
          document.getElementById("rank4").style.display = "none";
          document.getElementById("rank5").style.display = "none";
          document.getElementById("rank6").style.display = "none";
        });
      },
      //获取这个季度小组销售排名信息
      getGroupRankInfo(){
        queryGroupRankInfo(this.choosedQuarter).then(res => {
          let datas = res.data;
          this.groupSalesData = datas;
          document.getElementById("rank2").style.display = "block";
          document.getElementById("rank1").style.display = "none";
          document.getElementById("rank3").style.display = "none";
          document.getElementById("rank4").style.display = "none";
          document.getElementById("rank5").style.display = "none";
          document.getElementById("rank6").style.display = "none";
        });
      },
      //获取这个季度小团队销售排名信息
      getTeamRankInfo(){
        queryTeamRankInfo(this.choosedQuarter).then(res => {
          let datas = res.data;
          this.teamSalesData = datas;
          document.getElementById("rank3").style.display = "block";
          document.getElementById("rank2").style.display = "none";
          document.getElementById("rank1").style.display = "none";
          document.getElementById("rank4").style.display = "none";
          document.getElementById("rank5").style.display = "none";
          document.getElementById("rank6").style.display = "none";
        });
      },

      //获取这个季度质量排名信息
      getScoreRankInfo(){
        queryScoreRankInfo(this.choosedQuarter).then(res => {
          let datas = res.data;
          this.quanityData1 = datas;
          document.getElementById("rank4").style.display = "block";
          document.getElementById("rank2").style.display = "none";
          document.getElementById("rank3").style.display = "none";
          document.getElementById("rank1").style.display = "none";
          document.getElementById("rank5").style.display = "none";
          document.getElementById("rank6").style.display = "none";
        });
      },
      //获取这个季度小组销售排名信息
      getGroupScoreRankInfo(){
        queryGroupScoreRankInfo(this.choosedQuarter).then(res => {
          let datas = res.data;
          this.quanityData2 = datas;
          document.getElementById("rank5").style.display = "block";
          document.getElementById("rank1").style.display = "none";
          document.getElementById("rank3").style.display = "none";
          document.getElementById("rank2").style.display = "none";
          document.getElementById("rank4").style.display = "none";
          document.getElementById("rank6").style.display = "none";
        });
      },
      //获取这个季度小团队销售排名信息
      getTeamScoreRankInfo(){
        queryTeamScoreRankInfo(this.choosedQuarter).then(res => {
          let datas = res.data;
          this.quanityData3 = datas;
          document.getElementById("rank6").style.display = "block";
          document.getElementById("rank2").style.display = "none";
          document.getElementById("rank1").style.display = "none";
          document.getElementById("rank4").style.display = "none";
          document.getElementById("rank5").style.display = "none";
          document.getElementById("rank3").style.display = "none";
        });
      },

      initRankInfo(datas){
        this.getTeamRankInfo();
      },
      //初始化查询所有公司信息
      getAllCompanys(){
        getAllCompanys().then(res => {
          this.companys = res.data;
        })},
      //更改全国排行榜单类型
      changeRank(){
        //当前选中的排行榜类型
        let rank = document.getElementById("rankChange").value;
        if(0==rank){
          this.getSalesRankInfo();
        }
        //小组销售排行
        else if(1==rank){
          this.getGroupRankInfo();
        }
        //团队销售排行
        else if(2==rank){
          this.getTeamRankInfo();
        }
        //个人质量排行
        if(3==rank){
          this.getScoreRankInfo();
        }
        //小组质量排行
        else if(4==rank){
          this.getGroupScoreRankInfo();
        }
        //团队质量排行
        else if(5==rank){
          this.getTeamScoreRankInfo();
        }
      },
      //改成第二类排行榜
      changeRank2(){
        let choosedQuarter = document.getElementById("choosedQuarter");
        let index = choosedQuarter.selectedIndex;
        this.choosedQuarter = choosedQuarter.options[index].text;
        this.changeRank();
      },
      initEcharts(){
        var myChart = this.$echarts.init(document.getElementById("box"));
        let option = {
          color: ['#8CC4E7'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data:  this.echartsDataX,
          },
          /* 鼠标悬浮时显示数据 */
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter:"{c}万元"
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              formatter:'{value}(万)'
            }
          },
          series: [{
            data:  this.echartsDataY,
            type: 'line',
            areaStyle: {},
            // label: {//图形上的文本标签
            //   normal:{
            //    formatter: '{@data}万元',
            //     show: true,//显示数据
            //     color: '#00af58',
            //     position: 'top',
            //     fontSize:'14',
            //   },
            // },
          }]
        };

        myChart.setOption(option);
      },
      //获取Echarts图表data
      initEchartsData(companyId,dataType,gap){
        queryEchartsData(companyId,dataType,gap).then(res =>{
          this.echartsData = res.data;
          if(this.echartsData != null){
            this.echartsDataX = [];
            this.echartsDataY = [];

            if("1" == dataType && "1" == gap){
              for(let i in this.echartsData){
                this.echartsDataX.push(this.echartsData[i].week +"周")
                this.echartsDataY.push ((this.echartsData[i].money/10000).toFixed(2))
              }
            }
            else if("1" == dataType && "2" == gap){
              for(let i in this.echartsData){
                this.echartsDataX.push(this.echartsData[i].month +"月")
                this.echartsDataY.push ((this.echartsData[i].money/10000).toFixed(2))
              }
            }
            else if("1" == dataType && "3" == gap){
              for(let i in this.echartsData){
                this.echartsDataX.push(this.echartsData[i].quarter +"季")
                this.echartsDataY.push ((this.echartsData[i].money/10000).toFixed(2))
              }
            }
            else if("1" == dataType && "4" == gap){
              for(let i in this.echartsData){
                this.echartsDataX.push(this.echartsData[i].year +"年")
                this.echartsDataY.push ((this.echartsData[i].money/10000).toFixed(2))
              }
            }

            this.initEcharts();
          }
        })
      },
      //更改图表的公司
      changeGraphicCompany(){
        let companyId = "";
        if(null != document.getElementById("companyId")){
          companyId = document.getElementById("companyId").value;
        }
        //let dataType = document.getElementById("echartsDataType").value;;
        //暂时只查签约额排行
        let dataType = '1';
        //统计阶段
        let gap = this.gap;
        if("" == companyId){
          this.isAllCompanyFlag = true;
        }else{
          this.isAllCompanyFlag = false;
        }
        this.initEchartsData(companyId,dataType,gap);
        this.queryOperatorRankInfo(companyId);
      },

      queryOperatorRankInfo(companyId){
        queryOperatorRankInfo(companyId).then(res => {
          let data = res.data;
          if(null != data){
            this.operatorAmountRank = data.amountRank;
            this.operatorQuanityRank = data.quanityRank;
            this.groupInfo.avgPcPrice = data.avgPcPrice;
          }
        })
      },
      // echarts图按周统计
      changeTypeToWeek(){
        this.gap = '1';
        document.getElementById("week").style.opacity = 1.0;
        document.getElementById("month").style.opacity = 0.5;
        document.getElementById("quarter").style.opacity = 0.5;
        document.getElementById("year").style.opacity = 0.5;
        this.changeGraphicCompany();
      },
      // echarts图按月统计
      changeTypeToMonth(){
        this.gap = '2';
        document.getElementById("month").style.opacity = 1.0;
        document.getElementById("week").style.opacity = 0.5;
        document.getElementById("quarter").style.opacity = 0.5;
        document.getElementById("year").style.opacity = 0.5;
        this.changeGraphicCompany();
      },
      // echarts图按季度统计
      changeTypeToQuarter(){
        this.gap = '3';
        document.getElementById("quarter").style.opacity = 1.0;
        document.getElementById("week").style.opacity = 0.5;
        document.getElementById("month").style.opacity = 0.5;
        document.getElementById("year").style.opacity = 0.5;
        this.changeGraphicCompany();
      },
      // echarts图按年统计
      changeTypeToYear(){
        this.gap = '4';
        document.getElementById("year").style.opacity = 1.0;
        document.getElementById("week").style.opacity = 0.5;
        document.getElementById("month").style.opacity = 0.5;
        document.getElementById("quarter").style.opacity = 0.5;
        this.changeGraphicCompany();
      },
      /*排行榜查询最近三年的季度信息*/
      getAllQuarters(){
        getQuatersOfLatestThreeYear().then(res => {
          if(null != res.data && res.data.length>0){
            this.allQuarters = res.data;
            this.choosedQuarter = this.allQuarters[0];
          }
        })
      },
      //副总确认划分异常属于客户部还是技术中心受理
      abnormalDivideComfirm(){
        let abnormity = this.abnormalDivide;
        let department = abnormity.department;
        let missionId = abnormity.id;
        let projectId = abnormity.projectId;
        if(department == "" || null == department){
          this.$Message.warning("请选择责任部门");
          return;
        }
        dividedMission(missionId,department,projectId).then(res =>{
          if(null != res){
            this.$Message.info(res.data);
            this.table4();
            this.table1();
            this.abnormalDivideFlag = false;
          }
        });
      },

      //下载附件
      downloadAttachement(data){
        if (!data) {
          return
        }
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'demo-spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 18
                }
              }),
              h('div', '文件下载中...')
            ])
          }
        });
        axios.get(data.url, {responseType: 'blob',}).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          let fname = data.name;
          link.href = url;
          link.setAttribute('download', fname);
          document.body.appendChild(link);
          link.click();
          this.$Spin.hide();
        }).catch(res =>{
          this.$Spin.hide();
        })
      },
      //添加上传文件
      handleUpload(file){
        this.fileData2.push(file);
        return false;
      },
      removeFile(index){
        this.fileData2.splice(this.fileData2.findIndex(item => item.index === index), 1);
      },

      //异常责任划分弹窗
      dividedDuty(item){
        this.abnormalDuty = item;
        this.abnormalDuty.title = this.$store.getters.title;
        this.abnormalDutyFlag = true;
      },
      //责任划分确定
      dividedDutyConfirm(){
        let duty = this.abnormalDuty;
        let missionId = duty.id;
        let abnormityId = duty.objId;
        let department = duty.department;
        if( null == department){
          this.$Message.info("请选择责任部门。");
          return;
        }
        //提交后台确认异常责任归属
        dividedDuty(missionId,department,abnormityId).then(res =>{
          if(null != res){
            this.$Message.info(res.data);
            this.table4();
            this.abnormalDutyFlag = false;
          }
        })
      },

      //异常责任异议弹出窗口
      dutyOpposition(row){
        let startTime = moment().subtract(7,'days');
        let gap = startTime.diff(row.lastUpdateTime);
        if(gap > 0){
          this.$Message.warning("异常异议时间已超出(一星期),请选择时间范围之内异常信息");
          return;
        }
        this.choosedOppositionMission = row
        let time = moment(row.createTime).format('YYYY-MM-DD HH:mm:ss');
        this.choosedOppositionMission.createTime = time;
        this.dutyOppositonFlag = true;
      },
      //异常责任异议点击确认
      dutyOppositionConfirm(){
        let row = this.choosedOppositionMission;
        let id = row.objId;
        let dep = row.blameDep;
        let description = row.oppositionDescription;
        let projectId = row.projectId;
        let missionContent = row.missionContent;
        if(null == dep){
          this.$Message.warning("请选择责任部门");
          return;
        }
        if(null == description){
          this.$Message.warning("请输入异议内容");
          return;
        }
        dutyOppositionSubmit(id,dep,description,projectId,missionContent).then(res =>{

          if(null != res){
            this.$Message.info(res.data);
            this.dutyOppositonFlag = false;
          }
        });
      },



    },
    mounted(){
      this.$Spin.hide();
      // this.queryGroupInfo();
      // this.table1();
      // //this.queryMissionPage(this.current,this.size1);
      // this.queryWaitFlowPage(this.waitFlowCurrent,this.waitFlowSize);
      // this.queryDoneFlowPage(this.doneFlowCurrent,this.doneFlowSize);
      // this.queryCreatedMission(this.current2,this.size2);
      // this.getNoticeInfo();
      // this.initRankInfo();
      // this.initEchartsData();
      // this.getAllCompanys();
      // this.changeGraphicCompany();
      // //获取最近三年所有的季度，用于排行榜筛选
      // this.getAllQuarters();
      //this.interval = setInterval(this.showMarquee,3000);
    },


    created() {

    }

  }

</script>
<remote-script src="../../assets/home/js/main.js"></remote-script>
<remote-script src="../../assets/home/js/html5.js"></remote-script>
<remote-script src="http://echarts.baidu.com/build/dist/echarts-all.js"></remote-script>


<style scoped>
  @import "../../assets/home/css/global.css";
  @import "../../assets/home/css/style.css";

  .ivu-form-item{margin-top: 20px}
  html,img,fieldset {border:0;}
  html,body,form {margin:0;padding:0;}
  body {color:#000;background-color:#fff;}
  body,td { }

  h1,h2,h3,h4,h5,h6 {margin:0;padding:0;font-size:14px;}

  ul,ol {margin:0;padding:5px 5px 5px 0px;}
  dl,p  {margin:0;padding:5px 0;}


  .index_phb { margin-top:15px; }
  .index_box { border: 1px solid #e7e8ec; background: #f6f7f9; }
  .index_tit { line-height: 37px; background: #f1f4f6; padding: 0 19px; position:relative; }
  .index_tit h3 { font-weight:normal; font-size:15px; }
  .index_tit h3 em { display: inline-block; font-style: normal; height: 15px; line-height: 15px; padding-left: 8px; border-left: 4px solid #00437c; }
  .index_tit h3 span { font-size: 14px; color: #8b8c8e; margin-left:10px; }
  .index_tit .data { height:16px; width:16px; background:url(../../assets/home/img/icon11.png) no-repeat center center; position:absolute; top:50%; margin-top:-8px; right:19px; cursor:pointer; }
  .phb_sel { position: absolute; right: 15px; top: 0; }
  .phb_sel select { border: none; background: none; font-size: 13px; color: #00437c; }
  .phb_tab { }
  .phb_tab table { width:100%; }
  .phb_tab table td { height: 46px; vertical-align: middle; font-size: 14px; border-top: 1px solid #e7e8ec; }
  .phb_tab table td:first-child { padding-left:20px; }
  .phb_tab table tr:first-child td { border-top:none; }
  .phb_tab table td span { display: inline-block; width: 20px; height: 20px; line-height: 20px; border-radius: 20px; background: #8292a7; color: #fff; font-size: 12px; text-align: center; margin-right: 5px; }
  .phb_tab table td span.span1 { height:26px; background:url(../../assets/home/img/icon33.png) no-repeat center center; }
  .phb_tab table td span.span2 { height: 26px; background: url(../../assets/home/img/icon34.png) no-repeat center center; }
  .phb_tab table td span.span3 { height: 26px; background: url(../../assets/home/img/icon35.png) no-repeat center center; }
  .phb_tab table td i { font-style: normal; display: inline-block; padding-left: 8px; vertical-align: bottom; }
  .phb_tab table td i.i1 { background: url(../../assets/home/img/icon36.png) no-repeat left center; color: #2ac479; }
  /*.phb_tab table td i.i2 { background: url(../../assets/home/img/icon37.png) no-repeat left center; color: #ff4c39; }*/



</style>

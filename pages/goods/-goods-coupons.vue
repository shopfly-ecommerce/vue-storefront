<template>
  <div v-if="coupons && coupons.length" id="goods-coupons">
    <div class="pro-list">
      <div class="pro-title">优&ensp;惠&ensp;券</div>
      <div class="pro-content">
        <template v-for="(coupon, index) in coupons">
          <div
            v-if="index < 2"
            :key="coupon.coupon_id"
            class="coupons-item"
            @click.stop="handleReceiveCoupon(coupon)"
          >
            <i class="coupons-border-l"></i>
            <i class="coupons-border-r"></i>
            <span class="tj">满{{ coupon.coupon_threshold_price }}减{{ coupon.coupon_price }}</span>
          </div>
        </template>
        <a v-if="coupons.length > 2" href="javascript:;" @click.stop="sidebarOpen = true">查看更多>></a>
      </div>
    </div>
    <div :class="['coupons-sidebar', sidebarOpen && 'open']">
      <div class="title-sidebar">
        <i class="icon-title-sidebar icon-coupons"></i>
        <span class="title-title-sidebar">优惠券</span>
        <i class="icon-title-sidebar icon-close" @click.stop="sidebarOpen = false"></i>
      </div>
      <div class="content-sidebar" @click.stop="() => {}">
        <!--可领优惠券-->
        <div class="items-coupons">
          <div class="title-items-coupons">
            <i class="line line-l"></i>
            <span class="title-span">可领优惠券</span>
            <i class="line line-r"></i>
          </div>
          <div class="content-items-coupons">
            <div v-for="coupon in coupons" :key="coupon.coupon_id" class="item-b">
              <div class="detail-b">
                <div class="money-b">
                  <i class="arrow sysicon">￥</i>
                  <span class="money">{{ coupon.coupon_price | unitPrice('', 'before') }}</span>
                  <i class="arrow">.{{ coupon.coupon_price | unitPrice('', 'after') }}</i>
                </div>
                <div class="other-b">
                  <p>{{ coupon.title }}</p>
                  <p class="color-gary">满{{ coupon.coupon_threshold_price }}减{{ coupon.coupon_price }}</p>
                  <p class="color-gary">
                    有效期{{ coupon.start_time | unixToDate('yyyy-MM-dd') }} 至 {{ coupon.end_time | unixToDate('yyyy-MM-dd') }}
                  </p>
                </div>
              </div>
              <div class="btn-b">
                <a href="javascript:;" @click.stop="handleReceiveCoupon(coupon)" class="get-b is-get">立即领取</a>
                <i class="is-get-b"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 商品优惠券模块
   * 查看店铺优惠券列表、领取优惠券
   */
  import * as API_Members from '@/api/members'
  import * as API_Promotions from '@/api/promotions'
  import Storage from '@/utils/storage'
  export default {
    name: 'goods-coupons',
    props: ['goods', 'isSnapshot'],
    data() {
      return {
        sidebarOpen: false,
        coupons: []
      }
    },
    mounted() {
      if (this.isSnapshot) {
        this.coupons = this.goods.coupon_list
      } else {
        this.GET_CouponsList()
      }
      this.$nextTick(() => {
        window.addEventListener('click', this.handleClsoeSide)
      })
    },
    methods: {
      /** 获取优惠券列表 */
      GET_CouponsList() {
        const { seller_id } = this.goods
        API_Promotions.getShopCoupons(seller_id).then(response => {
          this.coupons = response
        })
      },
      /** 关闭优惠券侧边栏 */
      handleClsoeSide() {
        this.sidebarOpen = false
      },
      /** 领取优惠券 */
      handleReceiveCoupon(coupon) {
        if (this.isSnapshot) {
          this.$message.error('此优惠券为此商品的快照信息，不能领取！')
          return false
        }
        if (!Storage.getItem('refresh_token')) {
          this.$confirm('您还未登录，要现在去登录吗？', () => {
            this.$router.push({ path: '/login', query: { forward: this.$route.path } })
          })
          return false
        }
        API_Members.receiveCoupons(coupon.coupon_id).then(response => {
          this.$message.success('领取成功！')
        })
      }
    },
    destroyed() {
      window.removeEventListener('click', this.handleClsoeSide)
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../assets/styles/color";
  .coupons-item {
    position: relative;
    display: inline-block;
    height: 16px;
    padding-left: 2px;
    line-height: 16px;
    text-align: center;
    border-top: 1px solid #df3033;
    border-bottom: 1px solid #df3033;
    background: #ffdedf;
    font-size: 14px;
    white-space: nowrap;
    margin-right: 13px;
    cursor: pointer;
  }

  .coupons-item .tj {
    padding: 0 10px;
    color: #df3033;
    font-size: 12px;
  }

  .coupons-item .coupons-border-l,
  .coupons-item .coupons-border-r {
    position: absolute;
    top: -1px;
    display: block;
    height: 18px;
    width: 2px;
    overflow: hidden;
    background: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTkyNzE2N0RDQzAzMTFFNkIzRDQ4NkYwQkFFRTE3RjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTkyNzE2N0VDQzAzMTFFNkIzRDQ4NkYwQkFFRTE3RjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFOTI3MTY3QkNDMDMxMUU2QjNENDg2RjBCQUVFMTdGNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFOTI3MTY3Q0NDMDMxMUU2QjNENDg2RjBCQUVFMTdGNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//AABEIABIABAMBEQACEQEDEQH/xACKAAEBAAAAAAAAAAAAAAAAAAAIBwEAAwEAAAAAAAAAAAAAAAAABAYICRAAAAAHEQEAAAAAAAAAAAAAADVWBxc3OPACMmMUZAVlBhY2RmZYOVmJmREAAAECDhMBAAAAAAAAAAAAADM08AIyYgMTYwQUVDVVNlYBMWESQlJTRGR0hAUVZZUWhgc3l//aAAwDAQACEQMRAD8AXdyTNEob5ZyR1bWTa+2fwWMK3w/OAmqCbrxGIq2kkp5E9TXk1w3T7i9gxl/mEBP3xRmsluk+injkKLKaUK16pdBolyr1jiRo7VgwiQOv2TLWDNoU4E2KTl2VXAoQV5TYnpNxYtnFfSsicuIrwK/oPyDu9BwVOryujbxRH5x84R4gP//Z') no-repeat;
  }

  .coupons-item .coupons-border-l {
    left: 0;
    background-position: -2px 0;
  }

  .coupons-item .coupons-border-r {
    right: -2px;
  }

  .coupons-more {
    cursor: pointer;
    font-size: 12px;
  }

  .coupons-sidebar {
    position: fixed;
    top: 0;
    right: -300px;
    padding-top: 50px;
    width: 280px;
    height: 100%;
    z-index: 10000;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color: #f5f5f5;
    box-shadow: 0 0 15px #ccc;
    transition: all .3s ease-out;
  }

  .coupons-sidebar::-webkit-scrollbar {
    width: 5px;
  }

  .coupons-sidebar::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }

  .coupons-sidebar::-webkit-scrollbar-thumb {
    background-color: #7f7f7f;
  }

  .coupons-sidebar::-webkit-scrollbar-thumb:hover {
    background-color: #666
  }

  .coupons-sidebar::-webkit-scrollbar-thumb:active {
    background-color: #666
  }

  .coupons-sidebar.open {
    right: 0;
  }

  .title-sidebar {
    position: fixed;
    z-index: 10;
    top: 0;
    right: -300px;
    width: 280px;
    height: 40px;
    line-height: 40px;
    background-color: #f5f5f5;
    box-shadow: 0 0 15px #ccc;
    transition: all .3s ease-out;
  }

  .coupons-sidebar.open .title-sidebar {
    right: 0;
  }

  .icon-title-sidebar {
    display: block;
    width: 40px;
    height: 40px;
  }

  .title-title-sidebar {
    float: left;
    font-size: 14px;
  }

  .icon-title-sidebar.icon-coupons {
    float: left;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABn0lEQVRYR+2W200DMRRETyqADoAOoAKgA+iADqAD6ADoIHRAB5AKCBUEKoAOgk5kR5ZlL9mHNvmIpShay+s7npk73glbHpMt12cPYCcYOAVugeOR/fAFPMvAL+CD/2MOD7wUwBK4BN7HrA5cAG81AMrimPcEZZHawRoBHIbCfWWRZuUtjUYA0ZDpy84dAbPCbjXGOgMQnSOlz82U5AF4SkA4vwCugdcMnGv9tWagJoGb2bInSdcIUqmuClVKHhDwY1xfM2GTB5TFojdhkymgBCWtcwl8/gC+A4vzGoCSBPGAK/MEyj3JSwPNuQSC9X0BrwxeA1Ayoevd0Ny4C2hkKmoskJyFXAI9pE/WvmgbRKmh7sPpY1FPlwPIJdgYQE0C52UgdohMxLD6LMR5SYJz4Ow/CWp9HYuX2qoU57kESiZLP8GEs7YSpIW73iGCMEds24M+d8EmADoHUVMbRhbMgtQDJVnMCs3ZOgkr7ww6Pcp13JmBoa7jJsrWDBiJ3mZ97/62+hhSE7vAntdMY3+UGmDTnfgsb0vdoOv3DGydgT81WIuU0Rc6LwAAAABJRU5ErkJggg==') no-repeat center;
    background-size: 60%;
  }

  .icon-title-sidebar.icon-close {
    float: right;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAfklEQVRYR+1XywoAIAir///ogk4SkksDDdZVpms+yt6ST0+O3ySBsZF5TU71TwKlFNjrMVoTEP5UaJCDQxdBeBK46XVLUsuuZosEvlLg9ZxY/m4UIIF0Baw+t+ycA/8p4MqpuCaE53NcSgEoZ4FFhntBfQUC6fVDI/8Bf1SBnFmbNCErD2L7AAAAAElFTkSuQmCC') no-repeat center;
    background-size: 30%;
    margin-right: 10px;
    cursor: pointer;
    transition: all .3s ease-out;
  }

  .icon-title-sidebar.icon-close:hover {
    transform: rotate(180deg);
  }

  .content-sidebar {
    padding: 0 10px 50px 10px;
  }

  .items-coupons {
    clear: both;
  }

  .title-items-coupons {
    position: relative;
    text-align: center;
  }

  .title-items-coupons .line {
    position: absolute;
    top: 50%;
    display: block;
    margin-top: -1px;
    width: 33%;
    height: 1px;
    background-color: #afafaf;
  }

  .line.line-l {
    left: 0;
  }

  .line.line-r {
    right: 0;
  }

  .title-items-coupons .title-span {
    font-size: 12px;
    color: #333;
  }

  .content-items-coupons .item-b {
    position: relative;
    width: 255px;
    margin: 20px 0;
    height: 106px;
    background-color: #fff;
    overflow: hidden;
  }

  .item-b .detail-b {
    position: relative;
    float: left;
    width: 230px;
    height: 106px;
    background-color: #fff;
    overflow: hidden;
  }

  .item-b .btn-b {
    position: relative;
    float: right;
    width: 20px;
    height: 106px;
    background-color: #ff002d;
    color: #fff;
  }

  .item-b .btn-b:before {
    content: "";
    position: absolute;
    top: -20px;
    display: block;
    width: 10px;
    height: 100%;
    margin-top: 20px;
    background-size: 20px 6px;
    left: -10px;
    background-color: #fff;
    background-position: 100% 35%;
    background-image: linear-gradient(-45deg, #ff002d 25%, transparent 25%, transparent),
    linear-gradient(-135deg, #ff002d 25%, transparent 25%, transparent),
    linear-gradient(-45deg, transparent 75%, #ff002d 75%),
    linear-gradient(-135deg, transparent 75%, #ff002d 75%);
  }

  .item-b .get-b {
    display: block;
    width: 14px;
    font-size: 13px;
    color: #fff;
    padding: 12px 2px;
  }

  .item-b .get-b:hover {
    color: #fece75;
  }

  .item-b .money-b {
    width: 225px;
    font-family: Arial;
    font-size: 35px;
    font-weight: 700;
    line-height: 24px;
    padding-top: 10px;
    color: #ff002d;
  }

  .money-b .arrow {
    font-size: 16px;
    font-weight: normal;
  }

  .money-b .sysicon {
    margin-left: 10px;
  }

  .item-b .other-b {
    padding-left: 15px;
    font-size: 12px;
  }

  .item-b .other-b p {
    line-height: 15px;
  }

  .item-b .other-b .color-gary {
    color: #999;
  }

  .item-b .is-get-b {
    position: absolute;
    bottom: 5px;
    right: 35px;
    display: none;
    width: 50px;
    height: 50px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAe/ElEQVR4XuVdfZBlR1X/9dtEINlAwodGFLIRhZCZgURBsLDMLn+AVKVgtxRFKGEXLAqklA0lgqJkFlIaLKuYtSyiYCWzVvGhSNhFCkGUzFJQqKVkw8zwJeAmGEgEwm5mNgF25rX16z733b59u+/tfu++N2+WWzUV2Hdv3759vn/n9GmFc/TSmLkK6F0G6KsAdbH9r3upXQD4B0CfAHDK+/0EoE8Bagnon1ZY5T3n3KXOhS/SmLsG0LsB7AZcwnb9dYZRTgJYAvTxc4EptiUDWOlW1wDYCygSfquuU4Be2s4MsW0YQOOKXcD5r7VEL1T3VtE9+t6TgF4ANo4pfJGaYuqvqWYAjV0XAztfBmA/oDwbnrq2+g5AkTCeDTf/JkQq/ITKmNQsFwPqqalvqt5HzaAXgTPHFE56/sVwI47jqalkAJH26y3hUy99pzhsJwB1Atg42ZUUism5WHwMMiKZ4xGJMyPxjwJnD3U1n8T3Jt02VQwgnjvVfArhT1vbaxZ3adKLa+dKRuiJ85nEEIvTxghTwQAas1zE6xMcOhL9KFWrwgqJPzWXxhx9E/7RZLVdU8MIW8oA1sZf9PYEiT9GwissL7at7Fb/Lt+0F9AH2/0HPQ+sH95KH2HLGEBj9rWAmreOVvQ6Apydn7R674qJxJfhNzZpBTqi1yksH+3qvTnjTJwBxKF6e4O6Py2h1GJXhLdAES8DFrVdRP9OdIn+pTECo4aNA119c9tHFr9PlAE0ZmnnKRGRSx8C1heGVYl2oXdcA/SuEgjYgXtTl6R2XxEuLlnGWDs+2vzOb9IIjBioDSZm6ibCABLPfzAu9fo4sLE/l/vF3lK6KdkTBIiIKTBHgCWFZfonWZc4vQsNPsIisHbdsIyWM5mxM4D9WPXBiK2nV78/1/5pzL1ACJ4SLsp6ECcwOL57FeCQnyji/8+M8/uHc3MDGjMHgR41QuBdZDJ9IHfMHOLz3rEyQLPK14eB9flULs+AggUfMFJqMnrDhozCvLsAvUuQSDJe00VzsZjj2YsWo8oPjT12kzA2BtCYuyUS3mVJfSIqeAzoi0oeb9pW1HeReRTnssYT2eifaAOGxIFLzyusHMqV7pT7O2eA5tieuPzG3hRb344K0m9QtJVHU7VIyoLk3GO/9ULmKfgXyxkkgz4SIR0F1GWBeSwqLB/ImV/KvZ0ygDh7t4UTN/qwwsrBtkkJAzEPELq38xCxbT6pvwvxhBmCNj0J9GkxCZ0zQWcM0Ex8HEgJbTRmXgb0FuoOIx04plnPLG6VtKczgslgEgUkA/vOHX2EAyk+icYsowTmRbyLvs36nq7WoRMGaCA+7f3BNuJbO3/eLfUw0WT45tueTyXOKPdxjimmq3iHrEmEEfRRYP1AGxE15hjl0JfymWBJYWXPKN9TPDsyAzQTv7+7LYyRj6Tz40HCo4FCXSxOScyZgwqr1EzZl6h0PuvDwawm2temDeJMgE7MQQcMEPT2TwPNxI87i3TuNBd8KoowrSreWMiR/qAfbzOeAfCn3cMXh5hRjm9SRmaCkRggEuolEN/U9FHluwAMn5sfVtKyRTPhAY3ZeYsjDCf9EUaYBxSdXOdiHmB9X5NJEEzitvqY/etGmd/QDGAXx/8QJBK/xw9xVD7DQ71/WqSei2xVL+e0kpJASmCn8hYhJrN/jkTTudvY16RpGsxBkpMdmuRQDBDnxmZvX1SZR3wcAdYOtjlEWSs84s1S3PFB4Ozlo6r+2FTEd2LM74JJp4D+niZBiDBB63OxeWQzgNju/wlg+41cGJn40Jw7Io2jj5dManCLhsxlNzPQmCMM7DqIrcQMh4jDhYdDMMAsgR5PLTaDPNuH+KZC6XZAK4UV2TXUDaGbRgmY0wQmmKMJ8fMH2U5hFgOE7b6+Q2ElWrItEnW7swBZuYDxL3/FNgtz6z1t4VnX8woISSMTiAlhwsuHjbO0ajIDROz+aeDsVTE7GbD5rU5i1wubOp7D3EcUljPSzKlvaL8vzARrl8f8o4Bw8SWngLNXp/ouOQxwewDj3xfL5Uccvuj97cszvjtKp49RTJyhxzcDVwv56F+zbQ9nEfVRhZV9KfNNYoDIS6LJnQg6mKWaUibfxT2SbqaJ4g7iQ5Nw/NrmXTe1uhH61Qj5A2lmrJUBwl4/Mfr1q+KqqYYOTiXxbbxfOLXN39RGtK5/r0cHceYUJiZy6iKFJ4G1q9vC6wQGqIUp/NYG1V9LYGyZTW0jiqfZOmVSjj0KQifMyUJUByeIS3XEQW/VaI0MEHb8uC8+jI7V7T4RvvXdbVzYRqhx/F51oPSdXYZ9ZYIr7sClfJNoX9YxFpJ9CmhyCmcZFXiFKc1gVhsDBGL++IClOjWfN7Uef1X1m7l2Iv3hzCaTW+t7hxWCuhDGHbxIpNaogaMMEJH+qEoJOIqdLGqKpOTeU51r59LvIXv9q0fNcQScwihOEUAW0QRpNzGAL/2ngbVdIU6uO4pxM5FLrK7vr3r9ZvROQ1M/lldYbvWzUr5RY/akA/qcVFi+PPScfB+heveKaoHg5MKDNHmhvqM4viRKymI13aMxyw0q3ETCGKBT229Ni3GCwWJVYCfTyYujagAxWdxf4aSDc+hBcCjsO0QYoOb5N0i/2fiRNLFRiTfq8wGzNrVmKizdlXg/ivjlCHCNAXIerjtT0xVL+4tYdVK7l/5RGbTt+UC8H1XtAXDolMLyJf47Agxgtit5GxTCKj2ARU+tRNVx9ulA/dqIHmBitxAnqtojEUGNPgEGmKMD4aZCjyksi82sTqfqcU63RGlUvitq0nIJMun769hAky9QwwVqtKwwQCS7FPSSA6ZiG0k/phadTGEoLyxs0AIhbb52iRvJeQxQ24xwWmE52MFjG0s/gNFj8xRCjese0QLfLccPF4bW7+MT1Xs9BpjjoG6xZkPGz713tMrUcS2UhGU0X9yeLldzAcs459Ll2J4AnlBYuTohcjB9kd17BwwQdhrCkuLkz+Wd3cb9slNoVxe9/jx4uiYBXRJlkmPVzXWUVoHdRSW9XAbwyrzjTp0XYkSdxFEXRDx3dtxiMiS7RUs4pK3awFHnuJXPV9HBeF2mxpz25jnw11wG8FKPYUcpYFfG7vwFmiwVrV9NqxaF5eNh9ef7NOeG+h8Ys+rejGCcb83gbJS2DgPEucRdXC+ejjqJ9fjVdNYEYVFb1sy+f3nNHh1GoF33tkkNOoKwK4hp5e6FfueM+i8ZwDTQdnD/cL1AoFZgkEswDFC36fzXsKr0sk3J6r+ujtNKlsKSbcq3QxsuWzRyt77KVqp/Rws4NQBhTCDs39m1EAZIV5VVqcrz/jXm2DpFJLd9K1TbAqf139se3r8VQv2rAP4mRzNWN4k0FeuENXzBAH7pUTD8q0txukTVd7OYNu4LXez9T2i7Rj2X1KGkjem6+t2upXoesOOlAB4L6J2AeiSAjyms/HLqe3ztHUs/B3IDBgwrTIAX/4crZEYppBAi8btMe9imzSSpHx/wMxrarnWb90+do3z3byqsvKL434D+JUCR4JfSAMt1P6AeDugvKaxckT6+MYcOKJTqB1htUTCAFybEBqmkiYeCU0WL7O5C8sP+gek2suhtuoz6NKkLnXqfNI7ilq1XA+onAOwE0APwfQDnO0Dbg3Io1f3A5t8DO34ewHMBZDFA3cuP+QG1Yl0TNaiQgxBXI244Md3ZtGoTxvEmquTsAG7wvBZQPwKox1vJpnz1vwuoDQCPESb6HoD/AtSfA2tLBS6vMXMjoN4A6O8orD46leGEAdx+QkHHPOwIrpEBapzRhP87mmJ4Lz7n40a5Vzp3URsw7AlmNIcdX9bt1wE9C+Dh8idE1/cAeJg4vPcCmjb9RbadHH4MYFfRz1e6oIkTSMj6XmD9ipwi0mqYl+MI6j3UAD4CGCz7DiQgRi52HHbxc54Tlbxr1LIsy0xnTjoSezegHmvnQknX3wHwVUAfATY/AuzgeUOfBNRFQP81Cqvv0Jj9FIBnAbhbYeUn3e8Q/+A2lqmRUTIjgUpVVoMj6ERh5u0HqAH8bcZB2+6rkK6KHXOIOel7y9BMPwvoXQJsLhaSqzHzbgDPEM+dlTYhov4vAPoB/6Gw8gwhMptCnA/0X0+mGASptocQT0Nhu/pMBvABoVgBj48I6kPUAH4IGCz99iKAxi3hkyZUV++TdvNU1S+0oZnBLKjKeT0I4B6FlZ+qSm5hQkk4RhoW3ZSxWIBKBPTrCiuPF3v9RQBPsgWpq4PCG8sc7DOsHgLgN3I0gB3XjfOjkUCd1ukM4JqK6S37zmUGR8oLaWYsXlzfYvgA4L8B9Veu01ZKrok6PgngcYD+AIlddwb1fUDvFdxJXdUCmzcofP5PhTEKBuB+/+z+BB7IFnw+aO5/WBiANrzwAzSuuBY4700eAEM6PADgArvHXv8rgBtSfAeNma8AvScAmh7+Q4U5qBHOALjIOoj6PQqrLxFp/Sygmb+/G1ifpV/haADWY+zN1wAVTR5M0EUYoFYDGCkB254awNpq9WwSR2HVbKbQuPIPgN6fCKHuFyn/MoDPASjas9akKNYtVOPKBaDHM5AeBPrfAPDvgHoXiagx+0VAPQnof1Vh9adLacf7bESATyus/GLVCSQD5PVJrApyNCdQd/jrueKo/XBizenGADzvWgigCbx8Ddi81v5Otd2/lR3HS81gHDEhjNoHnD0B7KBPQGCH5wYwRmfYV7kk3Kx4/KWJePJbgB1/DOA+YOPnis4dwpgvFm3zJqBH7XOLfcdKFg4gTOXY9/EwQOsLcu3vJO7XmP0mgEvFiaND901A/4XC6o11QppGzyviud8NYIc8W9x6D7D+5PD2uNmKx18yAAsz8SZAPRro/2Fp802r+f8E1BMsc+BrAJ7G/yqs8N+yrklogG3HACKZH7V2WX8EUM8B8CgrdVgF1q8FHsp4vUjKMEFDUOcCwegfAPRpoHcP0H8c0KN/8JoQjK0x+wk6bxbI2TwkSR56+fQJpM5S3a6w/LMOc7BjKudHU/AgoB6Wmwsox2pHaWM+QGIewE0Zb50JKA+Kojr9wpubxMSx9fcqrFzqMAQXnJcgduoRTlKGnv8PAP1tADz82bSo1xhI+G0KK8+uaw8TDr4D0Js20TNY1ruE6S4kc3AeVRNl0sA3A+oS+4z+gMIq08JZ1wgaoLLrlC+dOifQic+Jt1MKiavf56NpdaLMUrqeC+ivApBFPXMS2PlvNmzDd63nbjx4OnDvtKeQ4I8A9XRAn3UcNxmrDvhYG2zMxxfEZNwLgIjeTXaT6EW7gf57AaUB9WKGk8CFbwDwd1IhdTNROUEUB9opEw5u1dDbKgysonCK0vMYWaCCzhXgJSQujtR+RcIxDejnyaJ/CNAfBfQTrQfP+H39KVbaB47bwObb+RgiUjtcE/LSQx6/wxyMMIgVcJs3zcKlgDLhmsbsXYDibwwb+a287gL0rcCZQymM4IXzOWFgKhI43jDQkXLxuF0UzmDt9wGambWvA/qZsoi3KKy8PEx8U4P4CaBH+8/dy78AgJDtPQUTWOKYzuUEcs6jdFqwxjz7caBHb1yI5Ep4PZljxxowzr3AxjNLj9+ARWyzx05kMl2aGPU2QH3bnobCLOLmEaA3B2DGuZfM8U1g4wjw4HsbGnM5NR0ZNQHpQJC7zai6uSDLWDk3S+z7W4AmCse8uWsfGbZ9C+h9B9h8P6WPCyqq9nNWYsrYuq7+TfzPMMtIMXDhiwF1g2UCLv7m00sCDez7oBrH0R7uv9Vi+qo9LxjHevxA7zOS4iVDFd9GSPlTwMYr7ffMSFKJczrzM1YDXfkSVkvZyMEwP19T8x88X6I1Uxuk9SSTQV4ZFONq5s4f6XzktwD9AKBI4JvjTSjnPgvgakBXJK26ICQqCzLKChvrFKo3A+rjCivPl80VnMfvigc/SOhoDPyHAWbvOJUDcxHwO4pwcJ3FABYFJECk7wf0DjcclBoAvvthforYMvoF80DvRTaK6B8qQsj6O0dLBk0sHWwTSsrdeu5VxfRuTUHASkKYgguTaq0S36hrOnq7/IWzDK/XAWb46FtoBfReLx48//05UlLO8wJ4Xs+AyUKmoXivpJ1fBajXlf4KQ7v+/wH6r4EHbgIuPAH0LiNTAngVoP8BUAxLG2sAbO1B/Hi81Eythr/1z6aD/a1DDRsM2jNOTeZAtnxRemmvogmWNpPijEObblKtET+AC/yX4jOEMnymTYwUarzXqunNtzK8LJM2Rv86Wb6ZoldP5b0aV94E9F4l8/ie1U74s2rK1zVL+vu254/xBV6Yi/172s4R4vyCEK/FC4eO7QloBxvaiVcmZdrujf1ehlymqHKQag34ASyzenVZrWPuEDPDGj31xEL6rMYgZm9NhpOcuQxQg9BYY/ZmW9SpP+xW9QhTEkWk6bkxDBYNIgkyFWsE6RQOkkTDr0elrD+vJMx6r37N+PiKQkuVaY56fxGw+b6UztZW/ep9wI5rAf3jAMEbYgL9Qaq1zgAGZHm3RfPU/UD/CKD+yar4GebeiSsIwauhH7CTjluRsCFgxAzhjQqrR+KM2X60nMYsYV86ol8G1JeA9ZemhHnNmnXWaeSdXBQKFvUUVcH1UqHAGfZeL8Boq7I2TpYYn4ALiRgM5UrEDy8HNOFTFkq4WAArZx4CaMKnUSmy7yqLL0sGnKE9fmoRSZT23ZRrU2tQNLwz+xShYWYPPwJsvDWFcetMyczhjhNdHXlbL9XLCAHLsvAaFpC4MWS4RgtVFe6mSQutYCpyGIMT8ZOKHBMOURIZNzNKeBeAWwFsAPobCqvRQytKos/tLSILC9qwMqfciCE1e18GNt4CnH+r5OzvBfrvE2/8IkAVeYJ7AMUTTd84iv1uE5a23zvaGFLbGtbQcMCFjvO2hlUdl0ERBZ2lfxGvnIkYNyykuvyBoGKm2NKVOuvA9k+kRQ7GAXsOoP8ZOPOaErYtM3Qlo5i08IcEPfxHGzKa7B1xhd8H1I86pWJngI3ZYbRBG3FTfu9oaxjVpNtFg6+OFRZWNockbw4Nq0IDwco1ADyI+LEM69NA7/0xLKA+3uzv2cOX9FkAL3eZQoi3WlbxFkkgM0ql+kbulaNYWOm7+TSfuBozv23xBIMsEih6fgqxxnGPRor993s5lvQddXt4Y/fqZsfFhVu50OouF/HLXawqxqDfprD6xqrGMRL8KUCxqFPMSnUThpgm4gdPsuDN5jv9+v3qmNRAZ5dGlX6JOC4DzhzLcQhTd1wHkkCDDqlb2iDCwq0GrYuGcqmM4MTtTO1GU6oCIjETRwf0DKBZMPJC1vwLeES/gFcUX0idU+p9IsWXx3oxx8bxNoRE294mNoionQTa0JC4spdgBDMwgFvvA9SvjOJMlXE7kbb+HU1OoXj8rM8vTtwiMPUZ2bRBxmB49swcaUwldt10DYC47L2W1a36o7eICQBC420SJR7se9pCuZTFLW23YYBBAWZcegxc/DEAT2ExqLNx4wZWCk2C+JybEPGS3MOqOm8SJZPx8IBGrnLuHS4aiIWDKQSvSxI3V/Z+R8q5TKVtyjg2IXPmxkkRvOpDFFo3v8LKaxMX3ahTT/ZV+yS1NYpsygu4ByOMAAoVZdPxzF5cio0j+TLZyfMoWyNAjF2/zk8QpTDDJO9xjqg9nXtczRgbRXJBe+4pn1yTsbaKdYoomNkbVM2GiFHuvWeK1N2VOwghuTHDpHonSczcd1WP1cvfZe159Q2t/DNbxVozUKsRTGwWjaG0gAPBsvihUjVr51PkAHq/Zj13U8B5gVND4FTu4i2puEEu0bq8vwRvhlH9piOIc3h3Y7No/7DP5mbRsuAZ7eL9QoThDl9ytlYxU/duoMcNlsyXcxOGkwOwM7QZPYMQrsT27HVJsC7HKqHb4XoWpkt/CPyp0yf1wIiGnsGVPELSYYV1B84kSF5pAZqis4b7X0N4xuuU9g+7u3m6JM64x3KO1VO5Mb9lfSNwcsqpmW3DgRG1U96DjT9Sj4zJOJggX62J6WFyhqXaLPvmVWyuZNr0b7vKno2byM0Oa4/FqQro707JX9QFxT3vKH7Occ6pL1N1aJQkd7hNmqneTg5b2iqCu++tHqiZ7/SJgCSfzRQ4Oi7qKAYZQF7o95dt0ALGMXFOuGw+7HgaiDKpOXinqQ7dV9lD/Rpg35pf1mgqmhgggAw2eZy1kGPoj50Uccb9HuckUQXo7D3/xfwCTTbHf3BkRAs0nkLpJR1OAf09w9i6cRNmEuNrzLH6mTuDRzpCN9DHuSEsD3r+wx0dG7Y75l+jZ9mLumMI5/QDXt/TFcxKAKWrscbFBFIcKr2BRjs8O+D1Nx52Ve+Ozq8c4fBoywQjHx+/qLB8YNQF15hjfR4LV2ha2Nls6i6N2esBRalnte/IvYnrp51M+Ph4ywC+g2fWvTHerzPNcMmiqidtqpakkFQvAfq6aTEvoqap8rnL6E4AWW3eQpwsDC/H0BpKNBzcXcMHko/FjTqBXhgTQAebMoUm1coowj3LfmSnUDB0boIoSskW7ZaqvH46XakOKUKh1LOGsJFIOe9Mbd7pOInOeciDf03qNJbEAOIPOAcTDD4nevJ23R8wz3RyUrfYRh4YwZ3Exi+RQ5qjNfs5BGi6V2w8M5CUzqLP3xHg7PyopWFicr2dWs1+hFeqX0w9uUgngwGCmcLoAcb2Y8wzjlNIdK+7yCBwYATRQ/oHR4G14105jLJ1/Rp76nhx8ji9ezZ23FjogvBh4vMda7viW8KDNDmdU1ySzACiBbyNpOZfoyXkDhO4KWYS6bou28WLn8JdQNx86pgdc47QEkvHgR79ljvamEJj7hrRKqw1IBZC9e4ennlMGOxo21g5WifUtLsJMpZv5rq6x/zylVmmNosBhAl8hLD1NI7Ax2VPNHUxi/MILPE0CVjU/XlDkDlMvoFNoho2lZjNo9RiS+PKR0j0wIM0iqsVO9Co5AWK57LrCodggGBU0ErQMBPogworh1OJO8x94jiKNHMEElsHj8MFFPf/8dQx5iJOAOsnupTy0Pzr3n47cFRHBo1o3gGs786dbzYDiBYIwMTm8xrVT9gx1EeB9QO5Ex+GGabpGWFMeu8SQZjZJUh+bTt/0nOxbx+KAeL+QLuTF4kOTgL9fVsVzk2aMaShAw+HcM9pbpXgiCltFbym7xuaASwTBFHCVk9fQinW5bs4AUccu0mYNLH99wXsPb/7OLC+t0kLho984eijgWwjMcAoTCBaxD3rRtZqulC+rhhGQKO31x3O9gKasMYwM8t2+vzv6YABgqgf39OqCYSBHIi3Mr0FYC2pR15XRBrHOBKuESZ2YN3C3reniBvU/sjE5yxGZgBLxCYmaI/5xSQEjnpjzqE/39SVYxxE62JMWRO2kJfkUGXUY8Da/jbHN0787g7s6IQBWpgg2UmRDybE6x0MTUYg6rZ+uG3RuiDeKGM0Ez49UeTUE3jTafcXcubfGQMkMAGPib2ubXKBhI/7COP0BXbN7Ap+bZtP6u8S3bDnEFV9AGdot/XOGt7iQM7uFDpR++6AnTJA+QGxk73TD4xuPxjaADYLuXvqUwmacp+YLiak9jegicmJImEihoc+vNuJwxf6ps4ZoHhJJEQU5zC9qKOdEQzbEaplA8jj48YSbK6AEPMgTxBa1+xEkcYs/QWav8A1WqjXxMxjYwCrDWo9B9y5ZHn5Im10qJiRi+D7ZniaCTIENcRJJoEUlo+nSLR7j3jv7CLGQyQokUViqGEoY+Ppqyyk+ipi8mIq/zTrCrtMnPmTHysDCBNw4Zii9R27bG3gaBeGjsVfaNwQkQTnr1hAJoRYvuWpXJMciuQLakOTSEeB/kKu9hGpN6ep1ydMbF/vzx0zl9HHzgClX7CTyJ+kWv1pUmI3DuQ6diKlkvUzEuohi7nLkXo/icPsoFoapj4xDgoN3n8EWDuYqkVSZz1RHyD0skj1inOrnh8l1CtTwZoSzD+q7yZzkbB2Rq1z0wsJzgaPgxO/Ex6u3CLzuz4AChX3jV3lT9wE1GTdHtBACDiiDUyOfhE4ezhXI8QIIhJHr4TvblHtipgD/051pX4TCC/5gI39XX1zKnNOxASEtYFJa4ZAH/d2MsKhSS9K6uK13ZdIeBac0NHbklL3LWOA0jeIYQbu8rJmgH95ffTaCDSO38suJoSAmyqNzAocyokYxjHfLWWA4oNERbPeMGYWilul6FMfGaWl3DgWUmPuBfTaIwie/8pkcGgcc3XHnAoGKBnBbHBgWERIte0q4n1GEMcmbSbksCkybKhwNDb3qSF8McGpYoAhGaF4TDx1cyzbEnD2zq6YQiBa9iYiAkhH0q8UbmLWbFSwjfO7/H0qGaBkBNPfl2qVf0PG+Kb6l8zB/7qXFH4aWxwCfoTIbXY8Rg5m7XgIZfysny4JOexYU80AFTfQ9Mc5LwUKHnYtOniOmAETVJtHu9I+HUyqcYhtwwBVZjANIncDPUqpbA8b91IFxydww40nZt9AV7jBJL9kWzKAv0ASRUiGzmz0GNJctC09IWACRduX4P4XnhMMECKbeOlE/QqHzd/94zCKwfYZYroXpZoXo4yT20Wlt7Gw//v/A3/UHpdHyabGAAAAAElFTkSuQmCC') no-repeat center;
    background-size: 100%;
  }
</style>

<template>
  <div id="coupons" class="w">
    <div class="title-coupons">
      <span></span>
      <h3>精选好券</h3>
      <span></span>
    </div>
    <div v-if="!coupons || !coupons.data.length" class="no-coupons">暂无优惠券</div>
    <div v-else class="list-coupons">
      <div
        v-for="(coupon, index) in coupons.data"
        :key="index"
        class="item-coupon"
        :class="[coupon.create_num === coupon.received_num && 'brought-out']"
      >
        <div class="img-coupon">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAaW0lEQVR4Xu2dB5iU1dWA3zOzS1kW2KXt0FTYxgJLUWEXCAYUa2JPbFFTTIzG2Hv7RRPDLgoKz2/UxJQ//kZjIokF+Gkqxt4bYgALKiIgRXrZnfs/Z74d+WZ2yvfNfLOzuHOehwce5t5zzz3n3PvdU+65Qg7aNAekTc8+N3lyCtDGlSCnADkFaOMcaOPTz+0AOQVo4xxo49PP7QA5BWjjHGjj08/tADkFaOMcaOPTz+0AOQVo4xxo49PP7QAZUoCaejNRhNJgkF7Aep+wWvJ59oXLZEOGhkwJbU4BUmJb7E6jbzMDfEEuM3CmQFF0qzw/u8YNZOkZo1jfsR0bMKwWH8+V95KHPSTDFaqcArhiV+zGY6aYsqBwkwinA/5kKHsWwhWHQ++uX7d8Q3xcWt5TFifr6/XvOQVIg6M1t5vBNHCLCCe7RdMx31KCcv1AWBAUw+XlAbnTLa502ucUIAXujakz1QZuNsIJQuoh9YJ2MPUk6NIhgojbK0rkyhTISqlLTgFcsG10vTlYDJNF+I6LbgmbDu0DVx0R2UQMx5cH5DGvxkiEJ6cADrhcU29qMdwsQpSoHHR20OSiQ+Hg/fY2NIYvOxUwqF8XWe+ge1pNcgqQgH2jp5hDfcKNCBPS4nKSzvt3g18dF9nIwPTKErk8k+Mq7pwCxODwqKnmKH8wJPixmRZAGP+lh8HI/rbRDDsKCuif6V0gpwA2ntfWm+Mw3IAwqqUEHx4n1i4ATK0okaszSUtOAYyRmjpOwscNAiMyyexkuC+fBMP72c4CsDUvn36l3eSrZH1T/b3tKsBk4xtdwKkS5HoRhqTKQC/7xdwFhFsreskNXo5jx9X2FOBh46/9iDON4ToRKjLF2FTxXnk4VPdtuV2gzSjAhMkmb2cBPzJBrhVhYKoCynS/0p5wU5SXQZ1OlSUyORNjf+MVoGymad99B+eI4WoEm7WdCXZ6g/OqI2Fo7whcm7oY+gUCss2bEfZi+cYqwAGTTYeSjpwnoG7VPl4zLpP4Yu0CGG6sCMivvR73G6cAw24znQoauQBBnSh7Qy1ecy7D+K47CgYFMr8LfGMUYFy96dwIFxnDpSJ0z7B8Mo6+qjdce2TkMCJcU95L6r0cfJ9XgBF3mKL2u7kMw8UidPGSOdnEpeHi6d+HTu1sFoHhy3Yl9B8gstMr2vZZBRgz3XQzu7ncwCUiFHjFkNaAp18xXH0EdO3YnBoRflreS/7gFZ37nALU3GpKxM9VBs77pglehaor/zfHQ/fCGCI23FARkFu9Er7i2WcU4KBbTe98P9cCP0OITKHwkiNZxnXhBBh1QEzht00r4KA6s1+ecL3AuVmWTcaHVw+gegJjwKyKEnGdduaE4Fa7A2iGrQS5UQxnIeQ5mcy+3ubn42FcabNZrCkSynr1kq2ZmF+rUwDNsDU+1O15mpMM20wwJVs4Z54KRVEHP2OoqwyIfvoyAq1GATTRMkgotTojW51T7u3XDb47FPoWw9ot8J818MansGazUwyptevcHu7SpPIo8BuGlQbkndSwJu+VdQUICV64BTg+nQzb5FNN3GJEPzh3vJWm3dAI23bD9t1Wn6CBx96GWW+kO0r8/iVd4LaTIn83hg2VAcmoUytrChDKsIUbBaKy4TLH5FiY9cR98URQ/3s0bNkJX9hW/twl8OArmaFPL4tM+14zBXi/MiBVmRnRwtriChDKsIVbBGKfdzM5WxvuiZVw3njQLT8RfLkNNtpicDc+DiszkKsrAvedCfn2e0WGdysCUp1JlrSYAmiipU+TMGB8JieUDLcK/pcToM/ea1kJu+zcA59u3Ntkzrvw0KvJRknt9+uOhkEltr6GXRUByajPI+MKUFtnjjYS2urHpMYWb3qFBP9t6NPsymZi/I1B+PDLvW2e/QB+929vaIrGoiagmoJ2kDyGlneXJZkZMYOfAM2wNdY3/uBMEe8E73eqLabqNzYViN4B/m8J/DVD5wCfwC3HRn6WBKaVl8gVqdDupI+3O4Bm2E7lZE2tFmG4EwIy0UYZefRQ+MUh0K1TeiOo+bfZFnubthDe+iw9nIl6641hjQX4fVYrA1vzoWxgiazJxKieKcDoOnO2D65FGJQJQp3gVKaddjCcXQNdYkTSnOCwt9m0HdbZ/G8rN8B/PRYSSkZh1P6WSdq+yf9p4F+VJXJiJgZNWwGaDnczBcqdEFjYHvQuXJ8uMOtNePI/TnolbqMn5xOHw0/HgzpU0oXdDZbgw34AxfflVrh1Lqx3mZWnQlRhHjbI+gzpJ+Xj9fD429bc7buLne6SznDBBDigyQsgMLm8RG5Od27R/dNSgJo686BIyGXrCPTqk7o783zw1Q5Ys8VaUbqyUgENnZ4wAn5YGzt27hanCmfDdti2a29PVYYFS+HRty3hOQWl7RcT4PhhUaZdEwL1MXy0Hm6ZDas2xcequ8H3D4SAZbUslDx+XN5dQh8hDZS9do184pSmWO1SVoCaevOMW5PurtPgQFterjpZFi+HOxe5n8LAHpbjJOBBDlAswe/YYwleD31bbQqRjNKO7eCiifCdobEFb+//+VewehPc8Djo5yYRFORDUYG1w23fw7rPN9HBwM4Hz6Vy/yIJGaorvjBDG30Mqewlf0tGZ/j3lBSgpt7cIXCJ00HC7XT1q0aHQRn/yUa45O+RzpZkeHV1/ev8ZoUVknVr9rsKWZ086vYNg/57/nsw773IT0Ay5FrsQS94HjXE2uGcgO6CGm94Zjnc95yTHs3bnFUDh0f5Ct2Yjq4VoHaKOcD4+DAVv72aZDccHTkJtbGvnAWfJ9gGo6d9xii4cGJqDNNeKvgN2yIFrFuyCn3+Undbva5IFfwRg/ee3J1SpnR8ttGKNVz+D/fnCx1H08bu/H7U2IYHKwJyhhM63CtAnfktwvlOkEe30cPao+dDsS2D788vwL0uHStqJqljxy3s2G194+2Hu807YO57sEgF3+AcozL+ikkWHWGTzXlvq6WOrecghbsWw0sfucVgtT9nHHw78gge9OczoLRb8vOBawWoqTerBSIz1l3QfWB/uP4Y2NUAj7wOj6QQYbv5WDjCRYhEBa6nd/shbuN2mPsuLFoGe1wIXv0KKvhDylMXfJhdn2yw+KAw40l4LcXjnNI0/Xug/o8wGMN9lQH5WTLRuFKAUdNMf38DKZKZjBTnv/90nKX1ySCW4FURZr8LTy+zwr5OoUehVctH3bV2RjvtH91u3RbYtMP6X/0EXPBQpPXhFm90NpGBhnZC/wG95ItEuFwpwOg6M9wnvOmWOK/bt/PD7F+C+hRigQpe7fbw6tI2etia/Q48swLUv+8U1B7Xu3q1A7wRvB4y10fR5kWAqVdnq+JYhHIaZlQEJOFh3ZUC1E41B2J4zSnz3LQr7gSNjfEdI9G49NqUbnv284Ta77rC7YJXU1OdLs99YK00p9C7C1x9FIzeHzRUmy6oKam0qV8hDI3GsjgeesUb76I6jmrsGcWGHaaA/Sq7iC2cFTkTV1ML3bsL4mlyojJ68rGglyHWbYY/vWD5BpyAZtFoaLeyxGKsXcBqVTz6Frz4kTvman6AZuYetJ83glfrQg+edsHvaQSNKj7xdqSr2cmcE7XREPeUEyLpNoYplQG5Ll4/VwqgSGrrjeanDU2XWO2vVsFj51sODgVdJeoVu+wflpnmFEb0hwG2xKnVm+GlD90JXh1LWrlTU8O8WPHq4tU5qLDDoGbfU/+B2UtgS9P33+kcnba75NBIZ5uBLcZH30E9pcneSGMH0K419eZagd84JShRO/1uqVloBz0Za4zgbxlKuoimR3MAdcVrwcZ0Ba9fGDXtdMXbD5j6f+pfWPA+qCmaSYhztTzujSLXO8DIetOnPazyahL/PC/SnbtlF7z5KVw1y6sRYuOpCsDlh8Pg3uknRRhjxTY27ogUvB481ZX89HJ3Fke6M59yIvS1ZTxp4cmCEvbrL9Js33GtAKFdoM7cI8LP0yVU+59dC+cfsheTHuAWL4ObnvACe3Mcw/rBZYdCRcAbwasppz4Fu2Wh7m21ONSx4+bg6dWMfzAKjowue2W4pCIgM6LHSEkBmvwBH0L6N3b0+vMD54CaWwrqGr7iEVjtcWE0/bZfNgnKeqUveBWqBm9U+HbB6x2CJ97JbMKIEyXR0LNGSCPAsLQiIIM9UYCms8AfBX7shKBkbTSi960yWPI5LE3otkiGqfnvfYvgmiPhIDXn3HeP6KGC19Wuwg+vbP3u68WRx96KzB1Mc6i0uo8dCOfZdtUwMr+PytKessyOPGWeNF3hcmiwpTWflDqHEk8mwneHpS94XeW62u2C1/974SPLx+D1bpXShG2dDq2EH8VIwRXDCeUBedQTBVAktXXmAQRHUad0J+Wmv/oH7v3B3s+Km772tipkPdip4PWgp7BrjxW+ffzd5DH8VMdNt99PxsKE2BUQf15RIr/zTgHqjYZk3kuX4Fj9BwdgUpX1SdDEDDfwX8dYSaGpQoMKfrt1sg8LXn0UC9+3Qsb2jKFUx8hkPy0t0yNGMqzA2eUlcr9nCqCIaurN3wWiLjWlPj3durV0ul7Z0pWnzpQHXrYY7xSeuzI1v706bVTwareHvcaaMKLh4qeWWau/tcPIfnDppNhUCowtL5EXPFWAg28zQ/OCeHZ7VRNGT7fdJFBbWm/mqHfQ7k6NJ4hO7WHhxe7EFEvw+l2fswSedRk8cjey961/fVyc626G7RUBabYvpHwItJNeU28e9eqS57VHwXHD9mJX4WgW7f+8CIved8aw2Rc4uw+gChVa8ba8/w/XwRPvwmsr3bmSnVGW2VZn1iTMk/hdRYk08914ogCjppoRfkMKqR3NGaKJFvVRGfCfbrBO2/e/7IyB+gmZlOB2gjqbVPAaqAnDO6usPIH3Vjsbo7W1Urtf7f94kOdj0MCe0iwJ3xMFCJ0F6sw8L97UUYL+eX7kCV5v42r69HsufAS3nwxqD9v9+5oRpIIPZ/mqLf/Kx9bdf/sF0NYm3ET09C8GPfXHut5u63d1RYlMjYXHMwXQQg/jyph47nhC7kZlttrOGgPXA5z6953CwfvDjFOsg9yytXDTY/BxCncH1BQ6fjgM6GEd4MJ5Air45z+wgk6aOLIvgpq6J46wlDwRiOG/ywNyYbw2nilAeIBlX5inYj2ypN/xPz1vXYZwAvqWnqZ/h5MmnfSJ10br7vS23QrWjBw9XO6LoDH/44YnF7zeKcRwWWVAfp9QQbxmwop1ZmIwyJOK18Dn6t4Xg0bFBwQN+z38mnW6zoE7DmiiygnDQXdHB3B3vnBLsnxAxeP5DqBIl68zB3bowdLo8OOKtaYsGOSiv77KhRomzUFyDujdQN3qI14Ui9XNsN0I9+TDVDc3iTOiAMmm9cwKM+7Xc3hq8w7yk7XV3zVieMlhVraO5vjpp+R1F2cKJ2O0tjaaoXTiSBhuez4mDo1axWhGQUdmpPLEXFYUQCcyaYY5ZetOHN1hu+eMva9p7W60om56qXRfPbknUjZ9OOqkA0E9egm/3cHGhs67trzcY+vaT/x55joZNCilayVZUwAmG19tR9TqTvqow4KLI1PAtWiDmm5/fL61rdvU6ansBSeMhCGRT8U0Q+j7ajXFi2ZQ1HcQvgHhoL9cLNWDZqYyevYUwPId/EGEnyQjXNO/x9jMHd0Fln0B5z6w73nrouc6tK/l+YwoDhWDIf71KyleOJ3Cl+5H9uzCN+pUfEddFW45T6qrjkrGx1i/Z1UBRk81l/oM05MR/q1SuC2qfujytfCT+1s21y4ZnW5+1yTUk0ZCWYz6hHY8eV9+SPG8egpf/N9I9MX9yPtlOLRvdtO9qFj69Elyybw5hVlVgJp6c5bAX5ww7ren7z0Jqwt35tNWXv2+BsP6wskHRqaxx5pD/qp3KV5wG51enwUm9lWmkAIUNx0WhONkaNXjbvmRVQWorTc/BP7shGi9hq2+br2HrxdHElXVcIKvpduoBaMrPlzyJd747T9+leL5U+n4zuykJOonQD8FTXCvVFedl7RTVINsK4A+g3a9W6L3pfZ6w+jkkdbNp0TQYcVzFM2ro+P7IR+aI5CycfhPbzr7GVbJsKoktkMr+wTU1pkFCHHSFxzxoNU20sukx4+IzM+PRWzHpQspnnMr7T92GOq0I2lfSN5Vi/f+j2GYDKtylZuRtR1AU8t9DaxMpdKInQeaTv7VTndVPTKlNcrMmgGWA0fvPCaCgrceDR3u2n36Vlrk5F37AuQ1PS1mzDUybLCrZ+WypgC19eY+LW6R6uz1e6oXQzVnTwNNM5/KXj6+Ri1V8CeNAI3SxQUTpNPrj1A8r4781Q6zWxIxSHzkXf8SyNdFieZLdVXUa4OJOZwVBRhVZw7xC7a9y50a6EHqQZvqaJhXL2Vc+DdnaWPuRkvcWkuzaHQuWSnawuf/HLLj89Z94Nnw0mcI/nNsRpThQxlW1fzRmQQjtrgCHDzFjPQLT6fzyKPa0L8/M3JW6ha+e7GVvNkSML7MCtJo5ZB4IHt2UvjiXyhecDv+jZ5dp/x6OP+Jv0GG2ha8YZkMq3JVPalFFaB2qjkVw0PpCsgv8NgvIvP+NIVb07ZvX5Au9uQrXg93sdKuwz1l1za6PHcfXRfeiX/L2owQJJUT8J8yLQq3+ZdUD3ZVUrZlFaDOnII4CwAl41p0nSC9VawFIe56OllP979r3T/d6jW7KFzLIBYW384tdFl8D12fmoFvm+2RAfdDJuwh/YfjP/NuyGtWI+dkqa5yda+6RRUAY6R2Khq1cpbWkIANmi30+7OgVNO9GqzCC1ppK1x4yQueay0iTSs7dljiUrS+respemoGnZ+5F9/ODOaYdeqOb/Rp+Mb+EHz2p0VCs31VqqtGuZ13yyoAMLrenOMDtQDSBl2ZWuBBS67qJ8ArUMEfOgi+W524Gql/8xqKFt5B5+fuQ3Z7SIB9IoFB+ErHIuXjkH560TFWGVKzEvIPk+py1yfMFlcAHjb+MR/xqYEkgU+vxOkcj1b2Vnezrnj7q93RGPzrP6F40fTQAU8jc55Ch87IwFp8KvCycVCQ8FGjIJi/0iH/AikvT+lhu5ZXAOs62SUCd3jKuDSQdciHwwfBMdWJBZ+3djnFC6ZR+MqD0OiiumQy2gJV+MrGhgQu/arjrPKvkajGLUbMXEy7R6S6LK3cqKwowAGTTYdARzTL3+HTTck4mNrvGljSQstHD7GCTPEg//MlFM/XyNwjcSNzrijo0AUprcWnAi8bm2yVa3rtSmAuInPo1nVRKmHfePRlRQGUmNo6cwPCr1wxzqPGur1rVe8jB4Ou/njQbuVrdJunkTkP6tXoKm/a1qXv0MSr3Jg9iDwLzMGXN0eGlLu4GuuOSVlTgKaag/oOTpqv+jifsN481mvjWmc4/BxLrN5WZK6eju+n8JBBGKHbVW5YhchcMHPxBefLkCEZNCf2zjprCtC0C9QjfJ3X5FyU7lrqJZNjhlr1BvSEHw9U4EXzptJhhS4+9yC9q6zvuP5Jvsr1EPECyBzd2qV6UFbSW7KqAAfdbnrkN4ZKziX4ArsXRLiHPhylD0GrSRdX8MbQ8d05dJt7q/vIXGiVj2n6lo9x8i1fgxH9ls+lIH+elJZ6XArLPa+yqgBNu8A0hMvckx6/h654NeW0ln98wQcpeH0W3eZNcRWZc7XKQXO5XkLMHIIyV4ZVZaTOcjq8y7oClM007XvvZvmeRvqnMxHt260Ajh1u1fLPj/dsS2MDha88FEq7chSZ69jVsst1Wy8fCx2TpPbAlxjm4WMOwYK5Mmz/zPmE02VYpq6GuaVrTL0ZbXSlpAjdO1mRORV8PFCHTSgyt3Aa/g2JTWfpMxgpVYGPQ0Ousb1vX4+k1WReRdRM889hcPnLIuKiLnmKk/aoW9Z3gPA86uaZ8+e/x2/tz7kkm6PG4DUWP14fcYiz4jUy1/n5P1K0YHr8yFxolY9pMtPGJF/lxmxEmI8wh3z/HKmsjFuOPdkcsv17q1EAZcSCpWbBrDeYpIUXE4GGYvUWzSFl8Vv5dmymyzP3xo3MuVzl6ox5M3xiZ0jlCyLi4tmJbIs5wc7Ymkj7aKMp2rOLZeu30/Pfy2HFWvh4o5Xl070ABvaEsaWJr0/5tm+i65Mz6fLM3agSfA1uVzlo5wUhodNutlQPzMjbvdnmf6vaAZQZy9eYMUY9YODuoXfD2oLd2+b02fLZj4KfvUPjmhUYEyTYqTsmMAh6HIDx+UPl30yoboyE/jb6d9O/G8W/psGfv7zB3+69Hfkdlhthpxh2I+wmyG7x7f1bfyPILp9h6x7Y6u/E1g6FbI1VkTvbQk40fqtTACX2/S/MAL+wyMCACOJVek0Uh/9pYA+GzWKZXIUIHjwbnZbIlI6toQodsFWsSh1aj8T6I6GdZbMIGzB8GhRW+v2sLO3Gqmx8VrKmAMu3mJ5sZySGwUaowlBhhO4C3TAUI9heF0xLIPtK56AxbBJhozFsQFiFYalPWIqPJWU9eFtEPAxBWmxpMQVYvt50CTZwgsDxmhcCuL7Fsq9IMhN0GsNugTfQhFp4NLriZ6pjtogCLF9vBgcbeEl0i86BJxwwcH9liZydLrIWUYAV603/YAN6vzlGFft0p9D2+utDUD7DTeUBSTuppkUUICyiZWvNCAyXGELf/j4i9Gh74kthxoZdBlaL8IkRHjbCX+K9AuYWe4sqQDRxnxrTccc6KgkyGEELnZZiKDVQ2taUQ60ZAc38+cDAB6KXPIT3ffksdfIItFvBh9tnVQESEb3EmHbtttLVt4MihK7BIN0R+hqD1s3qa2A/gSKj5wpDYdP5orWagWr6fSHWyf4zfKwKwhd5QTbRjq+Chk3l3SWlpM5UBd/qFSDViRljfCs2UNgYpDAfCoNQaFRBhHjxwVSHUs9DzhGUOvdyPVsDB1rtJ6A1MKct0JBTgLYg5QRzzClATgHaOAfa+PRzO0BOAdo4B9r49HM7QE4B2jgH2vj0cztATgHaOAfa+PRzO0AbV4D/B+WSy+o7T7rFAAAAAElFTkSuQmCC">
        </div>
        <div class="info-coupon">
          <div class="price-coupon">
            <em>¥</em>
            <strong>{{ coupon.coupon_price }}</strong>
            <span class="limit-coupon">满{{ coupon.coupon_threshold_price }}可用</span>
          </div>
          <div class="range-coupon">
            <span :title="coupon.title">{{ coupon.title }}</span>
          </div>
        </div>
        <div class="circle-coupon">
          <i></i><i></i>
        </div>
        <div class="opt-coupon" @click="receiveCoupon(coupon)">
          <div class="btn-opt-coupon">
            <a v-if="coupon.create_num === coupon.received_num"><b></b><span class="txt">已领完</span></a>
            <a v-else href="javascript:;"><b></b><span class="txt">立即领取</span></a>
          </div>
        </div>
      </div>
    </div>
    <div class="coupon-pagin">
      <el-pagination
        v-if="coupons"
        @current-change="handleCurrentPageChange"
        :current-page.sync="coupons.page_no"
        :page-size="coupons.page_size"
        layout="total, prev, pager, next"
        :total="coupons.data_total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Pagination } from 'element-ui'
  Vue.use(Pagination)
  import * as API_promotions from '@/api/promotions'
  import * as API_Members from '@/api/members'
  import Storage from '@/utils/storage'
  export default {
    name: 'coupons',
    head() {
      return {
        title: `优惠券市场-${this.site.title}`
      }
    },
    data() {
      return {
        loading: false,
        finished: false,
        params: {
          page_no: 1,
          page_size: 10
        },
        coupons: ''
      }
    },
    mounted() {
      this.GET_Coupons()
    },
    methods: {
      /** 加载数据 */
      handleCurrentPageChange(page_no) {
        this.params.page_no = page_no
        this.GET_Coupons()
      },
      /** 领取优惠券 */
      receiveCoupon(coupon) {
        if (!Storage.getItem('refresh_token')) {
          this.$confirm('您还未登录，要现在去登录吗？', () => {
            this.$router.push({ path: '/login', query: { forward: `${this.$route.path}`} })
          });
          return false
        }
        API_Members.receiveCoupons(coupon.coupon_id).then(() => {
          this.$message.success('领取成功！')
        })
      },
      /** 获取优惠券列表 */
      GET_Coupons() {
        API_promotions.getAllCoupons(this.params).then(response => {
          this.coupons = response
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  @import "../assets/styles/color";
  .title-coupons {
    height: 35px;
    line-height: 1;
    margin: 20px auto;
    text-align: center;
    span {
      display: inline-block;
      width: 35px;
      height: 18px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAA0CAMAAAA31HFIAAADIWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRGNjc3ODIxNzJCMzExRTc5M0NGODAyNjQxQjQwREMxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRGNjc3ODIyNzJCMzExRTc5M0NGODAyNjQxQjQwREMxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REY2Nzc4MUY3MkIzMTFFNzkzQ0Y4MDI2NDFCNDBEQzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REY2Nzc4MjA3MkIzMTFFNzkzQ0Y4MDI2NDFCNDBEQzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ii86lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADxQTFRFR3BM/yYd/yYd/yYdERERERERERERERERNRMSERER/yYd/yYd/yYd/////313/+fm/2BZ/66r/5WR/1FK729jUAAAAAx0Uk5TAJHuEDMlRkwDLORpnbioYwAAAJhJREFUOMvtkssSgyAMRQOixDY81P//V2npCyeELpxpF5zNncFjmBsFOIlxmm8x2xxTEfkQrLUIgFIk1+RXyrgPMI85SfsEucPzeo2t+KqXyU2keFZAIaB/r07n16DS9EIr9ldWVKA4R5eO5hw6wDre0xJX55bonFsrTnrkQ9xCpCDNkZ3hfRfVnCs1ew0Xau7nsMHKnv+KHfpCDWFb2K2VAAAAAElFTkSuQmCC) 0 0 no-repeat;
      overflow: hidden;
      vertical-align: middle;
    }
    h3 {
      display: inline-block;
      margin: 0 5px;
      color: #111;
      font-size: 18px;
      line-height: 35px;
      vertical-align: middle;
    }
  }
  .list-coupons {
    display: block;
    overflow: hidden;
  }
  .item-coupon {
    position: relative;
    display: block;
    float: left;
    height: 145px;
    border: 1px solid #f2f2f2;
    background: #fff;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.04);
    margin: 0 20px 20px 0;
    width: 388px;
    overflow: visible;
    &.brought-out {
      filter: grayscale(100%);
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
    &:hover .img-coupon {
      transform: translateX(5px);
    }
    .img-coupon {
      float: left;
      width: 104px;
      height: 104px;
      margin: 20px;
      border: 1px solid #f1f2f6;
      transition: all .2s ease-in-out,opacity 1s;
      img {
        width: 100px;
        height: 100px;
      }
    }
    .info-coupon {
      position: relative;
      float: left;
      z-index: 2;
      width: 190px;
      height: 120px;
      padding: 10px 0 15px;
      color: #333;
      outline: 0;
      .price-coupon {
        width: 190px;
        height: 45px;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      em {
        display: inline-block;
        font: 400 18px arial;
        vertical-align: top;
        margin: 3px 3px 0 0;
        color: $color-main
      }
      strong {
        display: inline-block;
        font: 400 30px arial;
        vertical-align: top;
        color: $color-main;
      }
      .limit-coupon {
        padding: 0 5px;
        color: $color-main;
        background: #fff4ec;
        display: inline-block;
        font-size: 12px;
        margin: 12px 0 0 5px;
        vertical-align: top;
      }
      .range-coupon {
        height: 36px;
        line-height: 18px;
        overflow: hidden;
        font-size: 12px;
        font-weight: 700;
        margin: 0 0 15px;
        cursor: default;
      }
    }
    .circle-coupon {
      i {
        position: absolute;
        z-index: 3;
        display: block;
        width: 18px;
        height: 9px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAG1BMVEUAAADz8/Py8vLy8vLy8vLy8vLy8vLy8vL///9lUcRzAAAACHRSTlMA/SvXlo9UUs0AFUkAAABRSURBVAjXY2BgYAoWNFVgADEcOzo6REDMwg4QEAMKSYBZjQoMLB0Q4MCgCGUJMURAWa0MFlBWM4MElNWIYCFk4TpEEaYgTEbYhnABwlUIlwIAYv88ye075uUAAAAASUVORK5CYII=) no-repeat;
        overflow: hidden;
        right: 42px;
        &:first-child {
          top: -1px;
          background-position: 0 -9px;
        }
        &:last-child {
          bottom: -1px;
          background-position: 0 0;
        }
      }
    }
    .opt-coupon {
      .btn-opt-coupon {
        position: absolute;
        top: 0;
        right: 0;
        width: 52px;
        height: 145px;
        background-color: $color-main;
        a {
          display: block;
          width: 52px;
          height: 100%;
          line-height: 22px;
          text-align: center;
          font-size: 14px;
          color: #fff;
        }
        b {
          position: absolute;
          z-index: 2;
          top: 0;
          left: -1px;
          display: block;
          width: 3px;
          height: 100%;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAGBAMAAAD0yzk/AAAAD1BMVEUAAAD///////////////+PQt5oAAAABHRSTlMAhfT54NzR8AAAABFJREFUCNdjEBJgMFEAkTAAAAgiAJl1WgYRAAAAAElFTkSuQmCC) top left repeat-y;
        }
        span {
          position: relative;
          display: block;
          top: 25px;
          width: 20px;
          margin: 0 auto;
          font-size: 16px;
        }
      }
    }
  }
  .no-coupons {
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    line-height: 100px;
  }
  .coupon-pagin {
    text-align: right;
    clear: both;
    padding: 20px 0;
  }
</style>

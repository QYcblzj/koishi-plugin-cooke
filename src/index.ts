import { Context, Schema } from 'koishi';
import axios from 'axios';

export const name = 'cooke';

export const usage = `
<head>
<style>
@font-face {
  font-family: 'dragonscript'
  src: url('dragonscript.tff')format('truetype')
}
p.dragon {font-family: dragonscript, sans-serif}
</style>
</head>

<body>
<p class = 'dragon'>The tutorial is very simple, enter the recipe you want to search for after the cooke</p>
<p class = 'dragon'><strong>Attention!!!: If you do not have the appKey and UID yet, please go to the official website to obtain them first
<br>Official website address:</strong></code>
<a href="http://luckycola.com.cn/" rel="nofollow">http(s): //luckycola.com.cn/</a>
<p class = 'dragon'>Please make sure that your app key is not filled in with colakey</p>
</p>
<img src="https://tse2-mm.cn.bing.net/th/id/OIP-C.4rfyn2NgH3MI_6xMH6ZT9gHaD7?w=295&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Description of the image">
<p class = 'dragon'>Do you like it, buddy?</p>
</body>
`

export interface Config {
  appKey: string;
  uid: string;
}

export const Config: Schema<Config> = Schema.object({
  appKey: Schema.string().description('AppKey').required(),
  uid: Schema.string().description('用户ID').required(),
});

export function apply(ctx: Context, { appKey, uid }: Config) {
  ctx.command('cooke <dish>', '查询菜谱')
    .action(async ({ session }, dish) => {
      if (!dish) {
        return '请输入菜名。';
      }

      const url = `https://luckycola.com.cn/food/getFoodMenu`;
      const params = {
        foodTitle: dish,
        appKey: appKey,
        uid: uid,
      };

      try {
        const response = await axios.post(url, params);
        const data = response.data;

        if (data && data.code === 0 && data.data && data.data.foodMenu) {
          const menu = data.data.foodMenu[0];
          let reply = `菜名：${menu.title}\n做法：\n`;
          menu.steps.forEach((step) => {
            reply += `${step.index}. ${step.content}\n`;
          });
          // 添加材料列表
          reply += `材料：${JSON.stringify(menu.ingredients)}\n`;
          // 检查是否有图片，并添加到回复中
          if (menu.image) {
            reply += `\n菜谱图片：\n${menu.image}`;
          }
          return reply;
        } else {
          return `抱歉，没有找到关于"${dish}"的菜谱。`;
        }
      } catch (error) {
        console.error(error);
        return '查询菜谱时发生错误。';
      }
    });
}
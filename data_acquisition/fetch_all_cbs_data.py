import requests  # 导入requests库，用于发送HTTP请求
import json  # 导入json库，用于处理JSON数据
import os  # 导入os库，用于与操作系统交互，如创建目录

# OData服务的API基地址 (Base URL)
# 07.13, 10:20
BASE_URL = "https://opendata.cbs.nl/ODataFeed/odata/85919ENG"

# 定义需要抓取的数据集合名称列表
# 07.13, 10:21
COLLECTIONS = [
    "TableInfos",
    "UntypedDataSet",
    "TypedDataSet",
    "DataProperties",
    "CategoryGroups",
    "SectorBranchesSIC2008",
    "Periods",
]

# 定义存放原始数据文件的输出目录
# 07.13, 10:22
OUTPUT_DIR = "./raw_data"

# 确保输出目录存在，如果不存在则创建
# 07.13, 10:23
os.makedirs(OUTPUT_DIR, exist_ok=True)


def fetch_and_save_collection(collection_name):
    """
    抓取单个数据集合的全部内容，并保存为JSON文件。
    函数会自动处理API分页，直至所有数据下载完成。
    """
    print(f"开始抓取: {collection_name}...")

    # 构建初始请求URL
    # 07.13, 10:24
    next_link = f"{BASE_URL}/{collection_name}"

    # 用于存储所有记录的列表
    # 07.13, 10:25
    all_records = []

    # 循环处理分页，直到没有下一页链接
    while next_link:
        try:
            # 设置请求头，指定接受JSON格式的响应
            # 07.13, 11:05
            headers = {"Accept": "application/json"}

            # 发送GET请求
            # 07.13, 11:06
            response = requests.get(next_link, headers=headers)
            response.raise_for_status()  # 如果请求失败则抛出异常

            # 解析JSON响应
            # 07.13, 10:27
            data = response.json()

            # 提取数据记录并添加到总列表中
            # 07.13, 10:28
            all_records.extend(data.get("value", []))

            # 获取下一页的链接
            # 07.13, 10:29
            next_link = data.get("@odata.nextLink")

            if next_link:
                print(f"  - 已抓取 {len(all_records)} 条记录，准备获取下一页...")

        except requests.exceptions.RequestException as e:
            # 捕获并打印网络请求相关的错误
            # 07.13, 10:30
            print(f"抓取 {collection_name} 时发生网络错误: {e}")
            break
        except json.JSONDecodeError:
            # 捕获并打印JSON解析错误
            # 07.13, 10:31
            print(f"无法解析来自 {collection_name} 的JSON响应。")
            break

    # 定义输出文件的完整路径
    # 07.13, 10:32
    output_path = os.path.join(OUTPUT_DIR, f"{collection_name}.json")

    try:
        # 将所有记录写入JSON文件
        # 07.13, 10:33
        with open(output_path, "w", encoding="utf-8") as f:
            # 使用indent=4美化格式，ensure_ascii=False以正确显示非ASCII字符
            json.dump(all_records, f, indent=4, ensure_ascii=False)
        print(f"成功! {len(all_records)} 条记录已保存至 {output_path}")
    except IOError as e:
        # 捕获并打印文件写入错误
        # 07.13, 10:34
        print(f"无法将数据写入文件 {output_path}: {e}")


# Python脚本主入口
# 07.13, 10:35
if __name__ == "__main__":
    # 遍历所有集合并执行抓取任务
    for collection in COLLECTIONS:
        fetch_and_save_collection(collection)
    print("\n所有数据采集任务完成。")

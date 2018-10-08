#!/usr/local/bin/python3
#coding=gbk
#the main code is from blog:https://www.cnblogs.com/txw1958/archive/2012/07/20/python3-watermark.html
import os, io, sys, re, time, json, random
from PIL import Image, ImageEnhance, ImageFilter

def watermark(img_source, img_water, img_new):
    try:
        im = Image.open(img_source)
        wm = Image.open(img_water)
        layer = Image.new('RGBA', im.size, (0,0,0,0))
        layer.paste(wm, (im.size[0] - wm.size[0], im.size[1] - wm.size[1]))
        newIm = Image.composite(layer, im, layer)
        newIm.save(img_new)

    except Exception as e:
        print(">>>>>>>>>>> WaterMark EXCEPTION:  " + str(e))
        return False
    else:
        return True

if __name__ == '__main__':
    if len(sys.argv) >=2:
        if sys.argv[1] == '-p':#
            for i in range(2,len(sys.argv)):
                watermark(str(sys.argv[i]),"H:\\blog\\postimg\\sy.png",str(sys.argv[i]))
        elif len(sys.argv) == 2: # one arg, the src_img name equals name of dest_img  
            watermark(str(sys.argv[1]), "H:\\blog\\postimg\\sy.png", str(sys.argv[1]))
        elif len(sys.argv) == 3:#two args that water_img could be omitted
            watermark(str(sys.argv[1]), "H:\\blog\\postimg\\sy.png", str(sys.argv[2]))
        elif len(sys.argv) == 4:
            watermark(str(sys.argv[1]), str(sys.argv[3]), str(sys.argv[2]))
    else:
        print('use  "python '+sys.argv[0]+' src_img [dest_img] [water_img]" to start!')
$(".selectSlots").change((event) => {
    console.log('sdfasdfasdf');
    let dataArray = $("." + $(event.currentTarget)[0].className);
    console.log(dataArray);
    for (let i = 0; i < dataArray.length; i++) {
      if (!$(dataArray[i])[0].checked) {
        $(".multiSlotSelect")[0].checked = false;
        break;
      }
    }
  });